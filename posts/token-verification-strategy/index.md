---
title: Token検証に対する工夫
description: Token検証に対する工夫 Java SpringBoot
date: 2026-01-09 12:30:00+09:00
categories:
    - Tech
tags:
    - Java
    - SpringBoot
    - JWT
    - Security
    - Japanese
---

# Token検証に対する工夫

## テクスタック
- Java 21
- Java SpringBoot 3.5.6
- MySQL 8.0

## 概要
ある日、自分がやっているプロジェクトからToken検証ロジックを組んで欲しいという要求を貰いました。
当時自分は**HandlerMethodArgumentResolver**を使って、AnnotationでのMember IDを持ってくるロジックでユーザー検証をやりました。

```java
HandlerMethodArgumentResolver
```

そのロジックをPRで送ってコメントを貰いましたが、コメントでは下のような言葉がありました。
「もし検証のためには絶対にMember IDを受け取る変数を設定しないとダメですか？他の方法はないんですか？」
これを聞いて、今まで無意識で**HandlerMethodArgumentResolver**を使っていたことを気づいてRefactoringをやりました。

このポーストは当時Refactoringでの自分の考えを作成します。
そして下のようにテーマを決めて話していこうと思っております。
1. なぜHandlerMethodArgumentResolverで作ったのか
2. 自分の考え

## 1. なぜHandlerMethodArgumentResolverで検証したのか

まず**HandlerMethodArgumentResolver**を使って検証した理由はSpringBootを使ってApplicationのドメインを作成しながらユーザーとの連関関係があったからです。

自分のサービスにはContestと言うドメインがあります。
このContestと言うドメインの中では開催者というContestを作った人の情報を入れれるColumnがあります。
なのでここにユーザーの情報を入れるためにControllerからMember IDをもらって連関関係を設定できるようにするために**HandlerMethodArgumentResolver**を使いました。

ここまでは合理的だと思っていましたが、この**HandlerMethodArgumentResolver**のMethod中にトークンを分解してその中身からIDをParsingしてくるロジックで組んでいたことが気になりました。

## 2. 自分の考え

例はJava SpringBootで説明します。
Java SpringBootを使ってみた人はJwt Tokenを **HandlerMethodArgumentResolver** で分解して中の情報を得る感じで使ってきたんだと思います。

```java
@Component
public class ArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation([Annotation_Name].class);
    }
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        HttpServletRequest httpServletRequest = webRequest.getNativeRequest(HttpServletRequest.class);
        if (httpServletRequest == null) {
            return null;
        }
        /*
        * 認証ロジック
        */
    }
}
```

もちろんこの方法もいい方法だと思っておりますが、もし自分が中の情報が要らなずただ自分のサービスに会員登録した人だけがAPIを使って欲しいMethodもある時に必要ない情報を強制的にParameterで受けていると思いました。
そして一つのファイルで多くの責任が入っていると思いました。
なのでこれを解決する方法を模索した結果、FilterとAOPを使うことにしました。

### Filter追加

なぜFilterを追加したかというと、既存ロジックは先ほど言った**HandlerMethodArgumentResolver**の中でJwt Tokenが有効なのかを検証するためのロジックが必要でした。

これがResolverのMethodの中に入っていることでこのMethodはJwt Token分解、Jwt Token有効検証の責任を持っていることになりました。
なのでこの責任の分散のためにFilterを使い、Headerに入ってくるTokenが有効なのかを検証するロジックをApplicationのControllerレイヤーに入ってくる前に処理することにしました。

```java
@Component
@RequiredArgsConstructor
public class JwtTokenRequestFilter extends OncePerRequestFilter {
    private static final String[] WHITE_LIST = {"/api/v1/users", "/api/v1/auth/login", "/css/*"};
    private final JwtValidator jwtValidator;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = JwtUtils.resolveToken(request.getHeader(HttpHeaders.AUTHORIZATION)).orElse(null);
        if (filterValidate(request, token)) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            Jws<Claims> claims = jwtValidator.validate(TokenType.ACCESS, token);
            request.setAttribute(JwtUtils.CLAIMS_KEY, AuthInfo.from(claims));
            filterChain.doFilter(request, response);
        } catch (JwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ErrorCode.INVALID_TOKEN.getMessage());
        }
    }

    private boolean filterValidate(HttpServletRequest request, String token) {
        return isWhiteList(request.getRequestURI()) || token == null;
    }

    private boolean isWhiteList(String requestURL) {
        return PatternMatchUtils.simpleMatch(WHITE_LIST, requestURL);
    }
}
```

上のMethodは**OncePerRequestFilter**というinterfaceをimplementしていますが、これは認証という動作はリクエスト一個ずつ一回だけ必要な作業なのでFilterを重なりながら動作するかもしれない危険性を予報しました。

### AOPの使用

そして先ほど言ってた役目によるMethod分離のためにAnnotationを二つ作りました。
一つ目は**@AuthUser**で、二つ目は**@PreAuthorize**です。

まず**@AuthUser**はトークンの送信者のUser IDを使うMethodにParameterでUser IDをもらえるAnnotationであるます。
このAnnotationは**HandlerMethodArgumentResolver**を使っています。

二つ目は**@PreAuthorize**です。
このAnnotationはMethodに制限を掛けれないかな？という疑問から始めました。
サービスのサーバーApplicationを開発しながらユーザーの役目によるMethodの使い方分けにSpring Securityを入れたことがあります。
Spring Securityを使った時に便利であり、Contextを使っていろんなレイヤーから共通的に情報を使えるというメリットがあるのを体感しました。
だけど便利な機能に比べて自分のサービスに入らない機能が多かったのもあり、パッケージが大きくなる問題があるというのを気づきました。
なので、Spring Securityを使わなず役目による使えるMethodを分離するためにこのAnnotationを作ることになりました。
目的を達成するためにAOPという機能を使うことになりました。
**@PreAuthorize** Annotationの中にnameというParameterを入れ、ユーザーの役目による検証ロジックを入れることになりました。

```java
@Component
@Aspect
public class PreAuthorizeAspect {
    @Around("@annotation(preAuthorize)")
    public Object checkRoleForAuthorize(ProceedingJoinPoint proceedingJoinPoint, PreAuthorize preAuthorize) throws Throwable {
        ServletRequestAttributes attrs = getRequestAttributes();
        HttpServletRequest request = attrs.getRequest();
        AuthInfo authInfo = getAuthInfo(request);
        userRoleVerification(authInfo, preAuthorize.role());
        return proceedingJoinPoint.proceed();
    }

    private ServletRequestAttributes getRequestAttributes() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
            return attributes;
        }
        throw new VerificationException(ErrorCode.NO_ATTRIBUTES);
    }

    private AuthInfo getAuthInfo(HttpServletRequest request) {
        if (request.getAttribute(JwtUtils.CLAIMS_KEY) instanceof AuthInfo authInfo) {
            return authInfo;
        }
        throw new VerificationException(ErrorCode.NO_TOKEN);
    }

    private void userRoleVerification(AuthInfo authInfo, String role) {
        if (role == null) {
            throw new VerificationException(ErrorCode.NO_AUTHORITY);
        }
        UserRole standardRole = UserRole.convert(role);
        if (!UserRole.verify(authInfo.role(), standardRole)) {
            throw new VerificationException(ErrorCode.NO_AUTHORITY);
        }
    }
}
```

このコードによって、チームメイトの人からMethodが役目による分離がしやすくなったという評価を貰うことができました。
そして役目が追加されてもUserRoleに追加して、検証ロジックをこのAspect Methodに入れることで、維持補修がしやすいと思っております。

## 感想

最近自分が今担当しているプロジェクトで認証を担当している人がJwt Tokenを無意識で使っていることに気づきました。
PRを貰った時、Jwt Tokenを使って理由に対してちゃんと説明ができない部分を見て、Jwt Tokenの概念や、利点について教えながら自分の考えが間違ったかもしれないかもしれないのでポーストに書いて意見を共有したかったのです。
間違っているとことか、論理的に変なとこがあったらぜひ教えて下さい。
