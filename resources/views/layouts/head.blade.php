
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}?ver=2.13" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    <link href="https://fonts.googleapis.com/css?family=Marmelad&display=swap" rel="stylesheet">
    <script>
        window._translations = {!! cache('translations'); !!};
    </script>
</head>