export type Language = "en" | "ru" | "uk";

export const translations = {
  en: {
    // Auth
    auth_subtitle: "SMC Analytics Engine",
    auth_connect_title: "Connect MetaApi Account",
    auth_connect_desc: "Enter your MetaApi token to authenticate and load your trading analytics.",
    auth_token_label: "MetaApi Token",
    auth_connecting: "Connecting…",
    auth_connect_btn: "Connect Account",
    auth_no_token: "No token? The dashboard loads with demo data.",
    auth_demo: "Continue with demo data →",
    auth_error_empty: "Please enter a MetaApi token to continue.",

    // Sidebar
    nav_dashboard: "Dashboard",
    nav_journal: "Trade Journal",
    nav_settings: "Settings",
    sidebar_connection: "Active Connection",
    sidebar_server: "MT5 Server",
    sidebar_logout: "Logout",

    // Dashboard header
    header_title: "SMC Analytics Engine",
    header_live: "Live",

    // KPI section
    section_metrics: "Key Metrics",
    kpi_asian_sweep_title: "Asian Sweep Reversal",
    kpi_asian_sweep_subtitle: "% of swept days that reversed bullishly",
    kpi_judas_title: "Judas Swing Bullish Bias",
    kpi_judas_subtitle: "% bullish days after London discount sweep",
    kpi_compression_title: "Volatility State",
    kpi_compression_subtitle: "Yesterday's range vs 20-day ADR",
    compression_trend: "Trend/Expansion",
    compression_chop: "Chop/Contraction",
    compression_neutral: "Neutral",

    // Charts section
    section_session: "HOD / LOD Session Distribution",
    chart_hod_title: "High of Day (HOD) Probability",
    chart_hod_subtitle: "Session where daily HOD is typically formed",
    chart_lod_title: "Low of Day (LOD) Probability",
    chart_lod_subtitle: "Session where daily LOD is typically formed",

    // Day of Week chart
    chart_dow_title: "Day of Week Profiling",
    chart_dow_subtitle: "Bullish vs Bearish close % by weekday",
    dow_bullish: "Bullish",
    dow_bearish: "Bearish",

    // Sessions
    session_asia: "Asia",
    session_london: "London",
    session_ny: "NY",
    session_other: "Other",

    // Footer
    footer_note: "Metrics computed from OHLC candles · All times in EST (UTC-5)",

    // Empty views
    journal_title: "Trade Journal",
    journal_desc: "Your trade history and notes will appear here.",
    settings_title: "Settings",
    settings_desc: "Manage your OANDA / MetaApi connection and preferences.",

    // Loading
    loading: "Calculating SMC metrics…",
  },
  ru: {
    // Auth
    auth_subtitle: "Аналитический движок SMC",
    auth_connect_title: "Подключить аккаунт MetaApi",
    auth_connect_desc: "Введите токен MetaApi для авторизации и загрузки торговой аналитики.",
    auth_token_label: "Токен MetaApi",
    auth_connecting: "Подключение…",
    auth_connect_btn: "Подключить аккаунт",
    auth_no_token: "Нет токена? Панель загрузится с демо-данными.",
    auth_demo: "Продолжить с демо-данными →",
    auth_error_empty: "Пожалуйста, введите токен MetaApi для продолжения.",

    // Sidebar
    nav_dashboard: "Панель",
    nav_journal: "Журнал сделок",
    nav_settings: "Настройки",
    sidebar_connection: "Активное соединение",
    sidebar_server: "Сервер MT5",
    sidebar_logout: "Выйти",

    // Dashboard header
    header_title: "Аналитический движок SMC",
    header_live: "Онлайн",

    // KPI section
    section_metrics: "Ключевые метрики",
    kpi_asian_sweep_title: "Разворот Asian Sweep",
    kpi_asian_sweep_subtitle: "% дней с подметанием, давших бычий разворот",
    kpi_judas_title: "Бычий уклон Judas Swing",
    kpi_judas_subtitle: "% бычьих дней после дискаунтного подметания Лондоном",
    kpi_compression_title: "Состояние волатильности",
    kpi_compression_subtitle: "Вчерашний диапазон vs 20-дневный ADR",
    compression_trend: "Тренд/Расширение",
    compression_chop: "Флет/Сжатие",
    compression_neutral: "Нейтральный",

    // Charts section
    section_session: "Распределение HOD / LOD по сессиям",
    chart_hod_title: "Вероятность HOD (максимум дня)",
    chart_hod_subtitle: "Сессия, в которой обычно формируется HOD",
    chart_lod_title: "Вероятность LOD (минимум дня)",
    chart_lod_subtitle: "Сессия, в которой обычно формируется LOD",

    // Day of Week chart
    chart_dow_title: "Профиль по дням недели",
    chart_dow_subtitle: "% бычьих и медвежьих закрытий по дням",
    dow_bullish: "Бычьи",
    dow_bearish: "Медвежьи",

    // Sessions
    session_asia: "Азия",
    session_london: "Лондон",
    session_ny: "NY",
    session_other: "Прочие",

    // Footer
    footer_note: "Метрики рассчитаны по OHLC-свечам · Всё время в EST (UTC-5)",

    // Empty views
    journal_title: "Журнал сделок",
    journal_desc: "Здесь появится история ваших сделок и заметки.",
    settings_title: "Настройки",
    settings_desc: "Управляйте подключением OANDA / MetaApi и настройками.",

    // Loading
    loading: "Вычисление метрик SMC…",
  },
  uk: {
    // Auth
    auth_subtitle: "Аналітичний рушій SMC",
    auth_connect_title: "Підключити акаунт MetaApi",
    auth_connect_desc: "Введіть токен MetaApi для авторизації та завантаження торгової аналітики.",
    auth_token_label: "Токен MetaApi",
    auth_connecting: "Підключення…",
    auth_connect_btn: "Підключити акаунт",
    auth_no_token: "Немає токена? Панель завантажиться з демо-даними.",
    auth_demo: "Продовжити з демо-даними →",
    auth_error_empty: "Будь ласка, введіть токен MetaApi для продовження.",

    // Sidebar
    nav_dashboard: "Панель",
    nav_journal: "Журнал угод",
    nav_settings: "Налаштування",
    sidebar_connection: "Активне з'єднання",
    sidebar_server: "Сервер MT5",
    sidebar_logout: "Вийти",

    // Dashboard header
    header_title: "Аналітичний рушій SMC",
    header_live: "Онлайн",

    // KPI section
    section_metrics: "Ключові метрики",
    kpi_asian_sweep_title: "Розворот Asian Sweep",
    kpi_asian_sweep_subtitle: "% підметаних днів з бичачим розворотом",
    kpi_judas_title: "Бичачий ухил Judas Swing",
    kpi_judas_subtitle: "% бичачих днів після дисконтного підметання Лондоном",
    kpi_compression_title: "Стан волатильності",
    kpi_compression_subtitle: "Вчорашній діапазон vs 20-денний ADR",
    compression_trend: "Тренд/Розширення",
    compression_chop: "Флет/Стиснення",
    compression_neutral: "Нейтральний",

    // Charts section
    section_session: "Розподіл HOD / LOD за сесіями",
    chart_hod_title: "Ймовірність HOD (максимум дня)",
    chart_hod_subtitle: "Сесія, в якій зазвичай формується HOD",
    chart_lod_title: "Ймовірність LOD (мінімум дня)",
    chart_lod_subtitle: "Сесія, в якій зазвичай формується LOD",

    // Day of Week chart
    chart_dow_title: "Профіль по днях тижня",
    chart_dow_subtitle: "% бичачих і ведмежих закриттів по днях",
    dow_bullish: "Бичачі",
    dow_bearish: "Ведмежі",

    // Sessions
    session_asia: "Азія",
    session_london: "Лондон",
    session_ny: "NY",
    session_other: "Інші",

    // Footer
    footer_note: "Метрики розраховані за OHLC-свічками · Весь час у EST (UTC-5)",

    // Empty views
    journal_title: "Журнал угод",
    journal_desc: "Тут з'явиться історія ваших угод та нотатки.",
    settings_title: "Налаштування",
    settings_desc: "Керуйте підключенням OANDA / MetaApi та налаштуваннями.",

    // Loading
    loading: "Обчислення метрик SMC…",
  },
} satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;
