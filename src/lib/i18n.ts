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
    kpi_overlap_title: "NY Midnight Overlap Prob.",
    kpi_overlap_subtitle: "% of days with 50+ pip deviation before NY open",
    kpi_expansion_title: "Avg NY Expansion",
    kpi_expansion_subtitle: "Average pip range during NY session (07:00–17:00)",
    kpi_winrate_title: "Estimated Winrate",
    kpi_winrate_subtitle: "Derived from overlap probability signal",
    pips: "pips",

    // Charts section
    section_session: "Session Analysis",
    chart_hodlod_title: "HOD / LOD by Session",
    chart_hodlod_subtitle: "Distribution of high/low of day",
    chart_volatility_title: "NY Session Volatility",
    chart_volatility_subtitle: "Pip range — last 15 trading days",
    legend_low: "Low",
    legend_mid: "Mid",
    legend_high: "High",

    // Sessions
    session_asia: "Asia",
    session_london: "London",
    session_ny: "NY",

    // Footer
    footer_note: "Metrics computed from OHLC candles · All times in UTC",

    // Empty views
    journal_title: "Trade Journal",
    journal_desc: "Your trade history and notes will appear here.",
    settings_title: "Settings",
    settings_desc: "Manage your OANDA / MetaApi connection and preferences.",

    // Loading
    loading: "Calculating metrics…",
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
    kpi_overlap_title: "Вероятность перекрытия NY Midnight",
    kpi_overlap_subtitle: "% дней с отклонением 50+ пипсов до открытия NY",
    kpi_expansion_title: "Ср. расширение NY",
    kpi_expansion_subtitle: "Средний диапазон в пипсах в сессии NY (07:00–17:00)",
    kpi_winrate_title: "Примерный винрейт",
    kpi_winrate_subtitle: "Рассчитан на основе сигнала вероятности перекрытия",
    pips: "пипс.",

    // Charts section
    section_session: "Анализ сессий",
    chart_hodlod_title: "HOD / LOD по сессиям",
    chart_hodlod_subtitle: "Распределение максимума/минимума дня",
    chart_volatility_title: "Волатильность сессии NY",
    chart_volatility_subtitle: "Диапазон в пипсах — последние 15 торговых дней",
    legend_low: "Низкая",
    legend_mid: "Средняя",
    legend_high: "Высокая",

    // Sessions
    session_asia: "Азия",
    session_london: "Лондон",
    session_ny: "NY",

    // Footer
    footer_note: "Метрики рассчитаны по OHLC-свечам · Всё время в UTC",

    // Empty views
    journal_title: "Журнал сделок",
    journal_desc: "Здесь появится история ваших сделок и заметки.",
    settings_title: "Настройки",
    settings_desc: "Управляйте подключением OANDA / MetaApi и настройками.",

    // Loading
    loading: "Вычисление метрик…",
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
    kpi_overlap_title: "Ймовірність перекриття NY Midnight",
    kpi_overlap_subtitle: "% днів з відхиленням 50+ піпсів до відкриття NY",
    kpi_expansion_title: "Сер. розширення NY",
    kpi_expansion_subtitle: "Середній діапазон у піпсах у сесії NY (07:00–17:00)",
    kpi_winrate_title: "Приблизний вінрейт",
    kpi_winrate_subtitle: "Розраховано на основі сигналу ймовірності перекриття",
    pips: "піпс.",

    // Charts section
    section_session: "Аналіз сесій",
    chart_hodlod_title: "HOD / LOD за сесіями",
    chart_hodlod_subtitle: "Розподіл максимуму/мінімуму дня",
    chart_volatility_title: "Волатильність сесії NY",
    chart_volatility_subtitle: "Діапазон у піпсах — останні 15 торгових днів",
    legend_low: "Низька",
    legend_mid: "Середня",
    legend_high: "Висока",

    // Sessions
    session_asia: "Азія",
    session_london: "Лондон",
    session_ny: "NY",

    // Footer
    footer_note: "Метрики розраховані за OHLC-свічками · Весь час у UTC",

    // Empty views
    journal_title: "Журнал угод",
    journal_desc: "Тут з'явиться історія ваших угод та нотатки.",
    settings_title: "Налаштування",
    settings_desc: "Керуйте підключенням OANDA / MetaApi та налаштуваннями.",

    // Loading
    loading: "Обчислення метрик…",
  },
} satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;
