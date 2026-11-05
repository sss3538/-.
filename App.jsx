import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sun,
  Moon,
  Plus,
  Search,
  Copy,
  Check,
  Star,
  Trash2,
  RefreshCw,
  ArrowRightLeft,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Wifi,
  WifiOff
} from 'lucide-react';

/**
 * Справочник поддерживаемых мировых фиатных и криптовалют.
 * Содержит русские названия, символы, поисковые теги и резервные курсы к 1 USD.
 */
const CURRENCIES_CATALOG = [
  { code: 'USD', name: 'Доллар США', symbol: '$', category: 'fiat', fallbackRate: 1, keywords: 'сша америка бакс dollar usa' },
  { code: 'EUR', name: 'Евро', symbol: '€', category: 'fiat', fallbackRate: 0.92, keywords: 'евросоюз европа euro eu' },
  { code: 'KZT', name: 'Казахстанский тенге', symbol: '₸', category: 'fiat', fallbackRate: 492.5, keywords: 'казахстан алматы астана tenge kazakhstan' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', category: 'fiat', fallbackRate: 96.4, keywords: 'россия москва ruble russia' },
  { code: 'GBP', name: 'Британский фунт', symbol: '£', category: 'fiat', fallbackRate: 0.785, keywords: 'великобритания англия лондон pound uk' },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', category: 'fiat', fallbackRate: 7.24, keywords: 'китай пекин yuan rmb china' },
  { code: 'AED', name: 'Дирхам ОАЭ', symbol: 'Dh', category: 'fiat', fallbackRate: 3.6725, keywords: 'оаэ дубай эмираты dirham uae dubai' },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', category: 'fiat', fallbackRate: 34.35, keywords: 'турция стамбул анталья lira turkey' },
  { code: 'JPY', name: 'Японская иена', symbol: '¥', category: 'fiat', fallbackRate: 152.8, keywords: 'япония токио yen japan' },
  { code: 'CHF', name: 'Швейцарский франк', symbol: '₣', category: 'fiat', fallbackRate: 0.865, keywords: 'швейцария цюрих franc switzerland' },
  { code: 'UZS', name: 'Узбекский сум', symbol: 'сўм', category: 'fiat', fallbackRate: 12820, keywords: 'узбекистан ташкент sum uzbekistan' },
  { code: 'KGS', name: 'Киргизский сом', symbol: 'с', category: 'fiat', fallbackRate: 86.2, keywords: 'кыргызстан киргизия бишкек som' },
  { code: 'GEL', name: 'Грузинский лари', symbol: '₾', category: 'fiat', fallbackRate: 2.73, keywords: 'грузия тбилиси батуми lari georgia' },
  { code: 'AMD', name: 'Армянский драм', symbol: '֏', category: 'fiat', fallbackRate: 387.5, keywords: 'армения ереван dram armenia' },
  { code: 'AZN', name: 'Азербайджанский манат', symbol: '₼', category: 'fiat', fallbackRate: 1.7, keywords: 'азербайджан баку manat' },
  { code: 'BYN', name: 'Белорусский рубль', symbol: 'Br', category: 'fiat', fallbackRate: 3.31, keywords: 'беларусь минск belarus' },
  { code: 'UAH', name: 'Украинская гривна', symbol: '₴', category: 'fiat', fallbackRate: 41.3, keywords: 'украина киев hryvnia' },
  { code: 'THB', name: 'Тайский бат', symbol: '฿', category: 'fiat', fallbackRate: 33.8, keywords: 'таиланд бангкок пхукет baht thailand' },
  { code: 'KRW', name: 'Южнокорейская вона', symbol: '₩', category: 'fiat', fallbackRate: 1385, keywords: 'корея сеул won korea' },
  { code: 'SGD', name: 'Сингапурский доллар', symbol: 'S$', category: 'fiat', fallbackRate: 1.32, keywords: 'сингапур singapore' },
  { code: 'HKD', name: 'Гонконгский доллар', symbol: 'HK$', category: 'fiat', fallbackRate: 7.77, keywords: 'гонконг hong kong' },
  { code: 'CAD', name: 'Канадский доллар', symbol: 'C$', category: 'fiat', fallbackRate: 1.39, keywords: 'канада торонто canada' },
  { code: 'AUD', name: 'Австралийский доллар', symbol: 'A$', category: 'fiat', fallbackRate: 1.51, keywords: 'австралия сидней australia' },
  { code: 'PLN', name: 'Польский злотый', symbol: 'zł', category: 'fiat', fallbackRate: 3.99, keywords: 'польша варшава zloty poland' },
  { code: 'CZK', name: 'Чешская крона', symbol: 'Kč', category: 'fiat', fallbackRate: 23.3, keywords: 'чехия прага koruna czech' },
  { code: 'SEK', name: 'Шведская крона', symbol: 'kr', category: 'fiat', fallbackRate: 10.65, keywords: 'швеция стокгольм sweden' },
  { code: 'NOK', name: 'Норвежская крона', symbol: 'kr', category: 'fiat', fallbackRate: 10.95, keywords: 'норвегия осло norway' },
  { code: 'INR', name: 'Индийская рупия', symbol: '₹', category: 'fiat', fallbackRate: 84.1, keywords: 'индия гоа дели rupee india' },
  { code: 'VND', name: 'Вьетнамский донг', symbol: '₫', category: 'fiat', fallbackRate: 25350, keywords: 'вьетнам ханой нячанг dong vietnam' },
  { code: 'IDR', name: 'Индонезийская рупия', symbol: 'Rp', category: 'fiat', fallbackRate: 15720, keywords: 'индонезия бали джакарта bali indonesia' },
  { code: 'BRL', name: 'Бразильский реал', symbol: 'R$', category: 'fiat', fallbackRate: 5.75, keywords: 'бразилия real brazil' },
  { code: 'SAR', name: 'Саудовский риял', symbol: 'SR', category: 'fiat', fallbackRate: 3.75, keywords: 'саудовская аравия riyal' },
  // Криптовалюты: geckoId — идентификатор монеты в CoinGecko для загрузки живого курса, color — цвет значка
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', category: 'crypto', geckoId: 'bitcoin', color: '#F7931A', fallbackRate: 0.0000112, keywords: 'биткоин крипта bitcoin crypto', decimals: 6 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', category: 'crypto', geckoId: 'ethereum', color: '#627EEA', fallbackRate: 0.000345, keywords: 'эфириум эфир крипта ethereum crypto', decimals: 5 },
  { code: 'USDT', name: 'Tether USD', symbol: '₮', category: 'crypto', geckoId: 'tether', color: '#26A17B', fallbackRate: 1.0, keywords: 'тезер стейблкоин крипта tether usdt stablecoin', decimals: 2 },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC', category: 'crypto', geckoId: 'usd-coin', color: '#2775CA', fallbackRate: 1.0, keywords: 'стейблкоин крипта circle usdc stablecoin', decimals: 2 },
  { code: 'DAI', name: 'Dai', symbol: 'DAI', category: 'crypto', geckoId: 'dai', color: '#F5AC37', fallbackRate: 1.0, keywords: 'дай стейблкоин крипта makerdao stablecoin', decimals: 2 },
  { code: 'TON', name: 'Toncoin', symbol: '◈', category: 'crypto', geckoId: 'the-open-network', color: '#0098EA', fallbackRate: 0.195, keywords: 'тонкоин телеграм крипта toncoin telegram', decimals: 4 },
  { code: 'NOT', name: 'Notcoin', symbol: 'NOT', category: 'crypto', geckoId: 'notcoin', color: '#1C1C1E', fallbackRate: 300, keywords: 'ноткоин телеграм крипта notcoin telegram', decimals: 2 },
  { code: 'BNB', name: 'BNB', symbol: 'BNB', category: 'crypto', geckoId: 'binancecoin', color: '#F3BA2F', fallbackRate: 0.0016, keywords: 'бинанс крипта binance bnb', decimals: 5 },
  { code: 'SOL', name: 'Solana', symbol: '◎', category: 'crypto', geckoId: 'solana', color: '#9945FF', fallbackRate: 0.0067, keywords: 'солана крипта solana', decimals: 4 },
  { code: 'XRP', name: 'XRP', symbol: 'XRP', category: 'crypto', geckoId: 'ripple', color: '#23292F', fallbackRate: 0.4, keywords: 'рипл крипта ripple xrp', decimals: 4 },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', category: 'crypto', geckoId: 'dogecoin', color: '#C2A633', fallbackRate: 5, keywords: 'догикоин доги крипта dogecoin doge', decimals: 4 },
  { code: 'ADA', name: 'Cardano', symbol: '₳', category: 'crypto', geckoId: 'cardano', color: '#0033AD', fallbackRate: 1.6, keywords: 'кардано крипта cardano ada', decimals: 4 },
  { code: 'TRX', name: 'TRON', symbol: 'TRX', category: 'crypto', geckoId: 'tron', color: '#EB0029', fallbackRate: 4, keywords: 'трон крипта tron trx', decimals: 4 },
  { code: 'AVAX', name: 'Avalanche', symbol: 'AVAX', category: 'crypto', geckoId: 'avalanche-2', color: '#E84142', fallbackRate: 0.04, keywords: 'аваланч крипта avalanche avax', decimals: 4 },
  { code: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB', category: 'crypto', geckoId: 'shiba-inu', color: '#E42D04', fallbackRate: 70000, keywords: 'шиба ину крипта shiba inu shib', decimals: 2 },
  { code: 'PEPE', name: 'Pepe', symbol: 'PEPE', category: 'crypto', geckoId: 'pepe', color: '#3D9A3C', fallbackRate: 100000, keywords: 'пепе крипта pepe meme', decimals: 2 },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', category: 'crypto', geckoId: 'polkadot', color: '#E6007A', fallbackRate: 0.2, keywords: 'полкадот крипта polkadot dot', decimals: 4 },
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK', category: 'crypto', geckoId: 'chainlink', color: '#2A5ADA', fallbackRate: 0.07, keywords: 'чейнлинк крипта chainlink link', decimals: 4 },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', category: 'crypto', geckoId: 'litecoin', color: '#345D9D', fallbackRate: 0.012, keywords: 'лайткоин крипта litecoin ltc', decimals: 5 },
  { code: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', category: 'crypto', geckoId: 'bitcoin-cash', color: '#0AC18E', fallbackRate: 0.0025, keywords: 'биткоин кэш крипта bitcoin cash bch', decimals: 5 },
  { code: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', category: 'crypto', geckoId: 'ethereum-classic', color: '#328332', fallbackRate: 0.05, keywords: 'эфириум классик крипта ethereum classic etc', decimals: 4 },
  { code: 'XLM', name: 'Stellar', symbol: 'XLM', category: 'crypto', geckoId: 'stellar', color: '#14181F', fallbackRate: 3, keywords: 'стеллар крипта stellar xlm', decimals: 4 },
  { code: 'ATOM', name: 'Cosmos', symbol: 'ATOM', category: 'crypto', geckoId: 'cosmos', color: '#2E3148', fallbackRate: 0.2, keywords: 'космос крипта cosmos atom', decimals: 4 },
  { code: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', category: 'crypto', geckoId: 'near', color: '#00C08B', fallbackRate: 0.25, keywords: 'нир крипта near protocol', decimals: 4 },
  { code: 'POL', name: 'Polygon', symbol: 'POL', category: 'crypto', geckoId: 'polygon-ecosystem-token', color: '#8247E5', fallbackRate: 3, keywords: 'полигон матик крипта polygon matic pol', decimals: 4 },
  { code: 'UNI', name: 'Uniswap', symbol: 'UNI', category: 'crypto', geckoId: 'uniswap', color: '#FF007A', fallbackRate: 0.12, keywords: 'юнисвап крипта uniswap uni', decimals: 4 },
  { code: 'APT', name: 'Aptos', symbol: 'APT', category: 'crypto', geckoId: 'aptos', color: '#00BFA5', fallbackRate: 0.12, keywords: 'аптос крипта aptos apt', decimals: 4 },
  { code: 'SUI', name: 'Sui', symbol: 'SUI', category: 'crypto', geckoId: 'sui', color: '#4DA2FF', fallbackRate: 0.3, keywords: 'суи крипта sui', decimals: 4 },
  { code: 'ARB', name: 'Arbitrum', symbol: 'ARB', category: 'crypto', geckoId: 'arbitrum', color: '#28A0F0', fallbackRate: 2, keywords: 'арбитрум крипта arbitrum arb', decimals: 4 },
  { code: 'OP', name: 'Optimism', symbol: 'OP', category: 'crypto', geckoId: 'optimism', color: '#FF0420', fallbackRate: 0.7, keywords: 'оптимизм крипта optimism op', decimals: 4 }
];

// Идентификаторы всех криптовалют для одного запроса к CoinGecko
const CRYPTO_GECKO_IDS = CURRENCIES_CATALOG.filter((c) => c.geckoId).map((c) => c.geckoId);

// Набор популярных валют при первом запуске (базовая — USD, остальные идут списком в этом порядке)
const DEFAULT_ACTIVE_CODES = ['USD', 'EUR', 'KZT', 'RUB', 'CNY', 'GBP', 'TRY', 'AED', 'USDT', 'BTC'];
const DEFAULT_PINNED_CODES = [];
const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

/**
 * Векторные круглые флаги и крипто-бейджи.
 * Гарантирует идеальную чёткость на Windows, macOS, iOS и Android без внешних картинок.
 */
const CurrencyAvatar = ({ code, size = 40 }) => {
  const renderVectorFlag = () => {
    switch (code) {
      case 'USD':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#B22234" />
            <path d="M0 4h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0z" fill="#FFF" />
            <rect width="18" height="19" fill="#3C3B6E" />
            <circle cx="5" cy="5" r="1.3" fill="#FFF" />
            <circle cx="10" cy="5" r="1.3" fill="#FFF" />
            <circle cx="15" cy="5" r="1.3" fill="#FFF" />
            <circle cx="7.5" cy="9.5" r="1.3" fill="#FFF" />
            <circle cx="12.5" cy="9.5" r="1.3" fill="#FFF" />
            <circle cx="5" cy="14" r="1.3" fill="#FFF" />
            <circle cx="10" cy="14" r="1.3" fill="#FFF" />
            <circle cx="15" cy="14" r="1.3" fill="#FFF" />
          </svg>
        );
      case 'EUR':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#003399" />
            <circle cx="18" cy="18" r="10" fill="none" stroke="#FFCC00" strokeWidth="2.2" strokeDasharray="2 3.24" />
          </svg>
        );
      case 'KZT':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#00AFCA" />
            <circle cx="18" cy="16.5" r="5.2" fill="#FEC50C" />
            <path d="M10 23.5c4 2.5 12 2.5 16 0-3 3.8-13 3.8-16 0z" fill="#FEC50C" />
          </svg>
        );
      case 'RUB':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="12" y="0" fill="#FFFFFF" />
            <rect width="36" height="12" y="12" fill="#0039A6" />
            <rect width="36" height="12" y="24" fill="#D52B1E" />
          </svg>
        );
      case 'GBP':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#012169" />
            <path d="M0 0l36 36M36 0L0 36" stroke="#FFF" strokeWidth="6" />
            <path d="M0 0l36 36M36 0L0 36" stroke="#C8102E" strokeWidth="2.5" />
            <path d="M18 0v36M0 18h36" stroke="#FFF" strokeWidth="9" />
            <path d="M18 0v36M0 18h36" stroke="#C8102E" strokeWidth="5" />
          </svg>
        );
      case 'CNY':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#EE1C25" />
            <polygon points="10,8 11.5,12.5 16,12.5 12.4,15.2 13.8,19.6 10,17 6.2,19.6 7.6,15.2 4,12.5 8.5,12.5" fill="#FFFF00" />
            <circle cx="20" cy="8" r="1.4" fill="#FFFF00" />
            <circle cx="23" cy="12" r="1.4" fill="#FFFF00" />
            <circle cx="23" cy="17" r="1.4" fill="#FFFF00" />
            <circle cx="20" cy="21" r="1.4" fill="#FFFF00" />
          </svg>
        );
      case 'AED':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="12" y="0" fill="#00732F" />
            <rect width="36" height="12" y="12" fill="#FFFFFF" />
            <rect width="36" height="12" y="24" fill="#000000" />
            <rect width="11" height="36" x="0" fill="#FF0000" />
          </svg>
        );
      case 'TRY':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#E30A17" />
            <circle cx="16" cy="18" r="7.5" fill="#FFF" />
            <circle cx="18" cy="18" r="6" fill="#E30A17" />
            <polygon points="24,18 28.5,19.5 25.8,15.6 25.8,20.4 28.5,16.5" fill="#FFF" />
          </svg>
        );
      case 'JPY':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#FFFFFF" />
            <circle cx="18" cy="18" r="8.2" fill="#BC002D" />
          </svg>
        );
      case 'CHF':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#DA291C" />
            <rect x="15" y="9" width="6" height="18" fill="#FFF" rx="0.8" />
            <rect x="9" y="15" width="18" height="6" fill="#FFF" rx="0.8" />
          </svg>
        );
      case 'UZS':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="11.5" y="0" fill="#0099B5" />
            <rect width="36" height="1" y="11.5" fill="#CE1126" />
            <rect width="36" height="11" y="12.5" fill="#FFFFFF" />
            <rect width="36" height="1" y="23.5" fill="#CE1126" />
            <rect width="36" height="11.5" y="24.5" fill="#1EB53A" />
          </svg>
        );
      case 'UAH':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="18" y="0" fill="#005BBB" />
            <rect width="36" height="18" y="18" fill="#FFD500" />
          </svg>
        );
      case 'GEL':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#FFFFFF" />
            <path d="M18 0v36M0 18h36" stroke="#FF0000" strokeWidth="6" />
            <circle cx="9" cy="9" r="2.2" fill="#FF0000" />
            <circle cx="27" cy="9" r="2.2" fill="#FF0000" />
            <circle cx="9" cy="27" r="2.2" fill="#FF0000" />
            <circle cx="27" cy="27" r="2.2" fill="#FF0000" />
          </svg>
        );
      case 'AMD':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="12" y="0" fill="#D90012" />
            <rect width="36" height="12" y="12" fill="#0033A0" />
            <rect width="36" height="12" y="24" fill="#F2A800" />
          </svg>
        );
      case 'BYN':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="24" y="0" fill="#D22730" />
            <rect width="36" height="12" y="24" fill="#009739" />
            <rect width="6" height="36" x="0" fill="#FFFFFF" />
          </svg>
        );
      case 'PLN':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="18" y="0" fill="#FFFFFF" />
            <rect width="36" height="18" y="18" fill="#DC143C" />
          </svg>
        );
      case 'THB':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="6" y="0" fill="#A51931" />
            <rect width="36" height="6" y="6" fill="#F4F5F8" />
            <rect width="36" height="12" y="12" fill="#2D2A4A" />
            <rect width="36" height="6" y="24" fill="#F4F5F8" />
            <rect width="36" height="6" y="30" fill="#A51931" />
          </svg>
        );
      case 'KGS':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#E8112D" />
            <circle cx="18" cy="18" r="7.5" fill="none" stroke="#FFEF00" strokeWidth="2.2" />
            <path d="M13 15c3 1 7 3 10 6M23 15c-3 1-7 3-10 6" stroke="#FFEF00" strokeWidth="1.6" />
          </svg>
        );
      case 'KRW':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#FFFFFF" />
            <circle cx="18" cy="18" r="7.5" fill="#CD2E3A" />
            <path d="M10.5 18a7.5 7.5 0 0 0 15 0 3.75 3.75 0 0 1-7.5 0 3.75 3.75 0 0 0-7.5 0z" fill="#0047A0" />
          </svg>
        );
      case 'VND':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#DA251D" />
            <polygon points="18,9.5 20.3,16.2 27.3,16.2 21.7,20.3 23.8,27 18,22.9 12.2,27 14.3,20.3 8.7,16.2 15.7,16.2" fill="#FFFF00" />
          </svg>
        );
      case 'CAD':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="36" fill="#FFFFFF" />
            <rect width="9" height="36" x="0" fill="#FF0000" />
            <rect width="9" height="36" x="27" fill="#FF0000" />
            <path d="M18 10l2.2 4.5 3.8-.8-1.8 4.3 2.5 1.5-5.7.5v4h-2v-4l-5.7-.5 2.5-1.5-1.8-4.3 3.8.8z" fill="#FF0000" />
          </svg>
        );
      case 'CZK':
        return (
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect width="36" height="18" y="0" fill="#FFFFFF" />
            <rect width="36" height="18" y="18" fill="#D7141A" />
            <polygon points="0,0 18,18 0,36" fill="#11457E" />
          </svg>
        );
      case 'BTC':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
            ₿
          </div>
        );
      case 'ETH':
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            Ξ
          </div>
        );
      case 'USDT':
        return (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            ₮
          </div>
        );
      case 'TON':
        return (
          <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-base">
            ◈
          </div>
        );
      default: {
        // Стильный градиентный аватар с кодом страны/символом для остальных валют
        const item = CURRENCIES_CATALOG.find((c) => c.code === code);

        // Криптовалюты: фирменный цвет монеты и короткая подпись
        if (item?.category === 'crypto') {
          const label = item.symbol.length <= 2 ? item.symbol : code.slice(0, 4);
          return (
            <div
              style={{ backgroundColor: item.color || '#334155' }}
              className={`w-full h-full flex items-center justify-center text-white font-bold tracking-tight ${
                label.length <= 2 ? 'text-base' : label.length === 3 ? 'text-[10px]' : 'text-[8.5px]'
              }`}
            >
              {label}
            </div>
          );
        }

        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white font-semibold text-xs tracking-tight">
            {item?.symbol || code.slice(0, 2)}
          </div>
        );
      }
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden shrink-0 ring-1 ring-black/10 dark:ring-white/15 shadow-sm flex items-center justify-center select-none"
    >
      {renderVectorFlag()}
    </div>
  );
};

/**
 * Утилита форматирования чисел с разделением разрядов пробелами.
 */
function formatDisplayAmount(value, maxDecimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  if (value === 0) return '0';

  // Для очень маленьких сумм (например, в BTC) увеличиваем точность автоматически
  let decimals = maxDecimals;
  const absVal = Math.abs(value);
  if (absVal > 0 && absVal < 0.01) {
    decimals = 6;
  } else if (absVal >= 0.01 && absVal < 1) {
    decimals = Math.max(maxDecimals, 4);
  } else if (absVal >= 10000) {
    decimals = Math.min(maxDecimals, 2);
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Форматирует сырую строку ввода: разделяет тысячи пробелами, сохраняя дробную часть при вводе.
 */
function formatRawInputString(raw) {
  if (!raw) return '';
  const cleaned = raw.replace(',', '.').replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const integerPart = parts[0] || '';
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (parts.length > 1) {
    return `${formattedInt},${parts[1].slice(0, 6)}`;
  }
  return formattedInt;
}

/**
 * Преобразует строку ввода обратно в число с плавающей точкой.
 */
function parseRawInput(raw) {
  if (!raw) return 0;
  const normalized = raw.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

export default function App() {
  // Светлая / тёмная тема: по умолчанию светлая, выбор пользователя запоминается
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('fx_theme_v2') === 'dark';
    } catch {
      return false;
    }
  });

  // Базовая валюта и введённая сумма
  const [baseCurrency, setBaseCurrency] = useState(() => {
    try {
      return localStorage.getItem('fx_base') || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [rawAmount, setRawAmount] = useState(() => {
    try {
      const saved = localStorage.getItem('fx_amount');
      return saved !== null ? saved : '1 000';
    } catch {
      return '1 000';
    }
  });

  // Выбранный список валют и закреплённые валюты
  const [activeCodes, setActiveCodes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fx_active_codes'));
      return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_ACTIVE_CODES;
    } catch {
      return DEFAULT_ACTIVE_CODES;
    }
  });

  const [pinnedCodes, setPinnedCodes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fx_pinned_codes'));
      return Array.isArray(saved) ? saved : DEFAULT_PINNED_CODES;
    } catch {
      return DEFAULT_PINNED_CODES;
    }
  });

  // Сворачиваемая панель быстрых сумм (сохраняется в localStorage)
  const [showQuickAmounts, setShowQuickAmounts] = useState(() => {
    try {
      const saved = localStorage.getItem('fx_show_quick');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Вид списка: 'grid' (2 колонки) или 'list' (1 колонка)
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('fx_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  // Формат отображения справочного курса: false -> 1 USD = X, true -> 1 X = USD
  const [inverseRateView, setInverseRateView] = useState(false);

  // Курсы валют относительно 1 USD
  const [rates, setRates] = useState(() => {
    const initial = {};
    CURRENCIES_CATALOG.forEach((c) => {
      initial[c.code] = c.fallbackRate;
    });
    return initial;
  });

  const [isLive, setIsLive] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Модальное окно ('add' | 'selectBase' | null) и всплывающие уведомления
  const [modalMode, setModalMode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Сохранение пользовательского состояния в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fx_theme_v2', darkMode ? 'dark' : 'light');
      localStorage.setItem('fx_base', baseCurrency);
      localStorage.setItem('fx_amount', rawAmount);
      localStorage.setItem('fx_active_codes', JSON.stringify(activeCodes));
      localStorage.setItem('fx_pinned_codes', JSON.stringify(pinnedCodes));
      localStorage.setItem('fx_show_quick', String(showQuickAmounts));
      localStorage.setItem('fx_view_mode', viewMode);
    } catch {
      // Безопасный fallback для приватного режима браузера
    }
  }, [darkMode, baseCurrency, rawAmount, activeCodes, pinnedCodes, showQuickAmounts, viewMode]);

  // Показ микро-уведомления (Toast)
  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  // Загрузка актуальных курсов с open.er-api.com + крипто-котировок
  const fetchExchangeRates = useCallback(async (manual = false) => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      if (data && data.rates) {
        setRates((prev) => {
          const updated = { ...prev };
          Object.keys(data.rates).forEach((key) => {
            updated[key] = data.rates[key];
          });
          return updated;
        });
        setIsLive(true);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        );
        if (manual) showToast('Курсы валют обновлены');
      }

      try {
        // Один запрос сразу за всеми криптовалютами из каталога
        const cryptoRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${CRYPTO_GECKO_IDS.join(',')}&vs_currencies=usd`
        );
        if (cryptoRes.ok) {
          const cryptoData = await cryptoRes.json();
          setRates((prev) => {
            const updated = { ...prev };
            CURRENCIES_CATALOG.forEach((c) => {
              const usdPrice = c.geckoId ? cryptoData[c.geckoId]?.usd : null;
              if (usdPrice) updated[c.code] = 1 / usdPrice;
            });
            return updated;
          });
        }
      } catch {
        // Оставляем встроенные резервные курсы криптовалют при лимите API
      }
    } catch {
      setIsLive(false);
      if (manual) {
        showToast('Офлайн-режим: используются резервные курсы');
      }
    } finally {
      setIsLoadingRates(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchExchangeRates(false);
  }, [fetchExchangeRates]);

  // Автофокус на строку поиска в модальном окне
  useEffect(() => {
    if (modalMode && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [modalMode]);

  // Закрытие модального окна по Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalMode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Числовое представление суммы
  const numericAmount = useMemo(() => parseRawInput(rawAmount), [rawAmount]);

  // Мета-данные базовой валюты
  const baseCurrencyMeta = useMemo(
    () => CURRENCIES_CATALOG.find((c) => c.code === baseCurrency) || CURRENCIES_CATALOG[0],
    [baseCurrency]
  );

  // Кросс-курс между двумя валютами
  const getCrossRate = useCallback(
    (fromCode, toCode) => {
      const fromRate = rates[fromCode] || 1;
      const toRate = rates[toCode] || 1;
      return toRate / fromRate;
    },
    [rates]
  );

  // Обработка ввода суммы с разбивкой тысяч пробелами
  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setRawAmount('');
      return;
    }
    setRawAmount(formatRawInputString(val));
  };

  // Подстановка быстрой суммы
  const handleQuickAmount = (val) => {
    setRawAmount(formatRawInputString(String(val)));
  };

  /**
   * Простая и предсказуемая смена базовой валюты:
   * Введённое число сохраняется без изменений (например, 1 000 USD -> 1 000 EUR),
   * а прежняя базовая валюта аккуратно занимает место выбранной в списке.
   */
  const handleSelectBaseCurrency = (targetCode) => {
    if (targetCode === baseCurrency) return;

    setActiveCodes((prev) => {
      const next = [...prev];
      const targetIdx = next.indexOf(targetCode);
      const hasOldBase = next.includes(baseCurrency);

      if (targetIdx !== -1 && !hasOldBase) {
        next.splice(targetIdx, 0, baseCurrency);
      } else if (!hasOldBase) {
        next.unshift(baseCurrency);
      }
      if (!next.includes(targetCode)) {
        next.push(targetCode);
      }
      return next;
    });

    setBaseCurrency(targetCode);
  };

  // Избранное: звёздочка выделяет валюту и при закреплении один раз поднимает её в начало списка.
  // Дальше порядок полностью ручной — его можно менять в режиме «Порядок».
  const togglePin = (e, code) => {
    e.stopPropagation();
    const exists = pinnedCodes.includes(code);
    setPinnedCodes((prev) => (exists ? prev.filter((c) => c !== code) : [...prev, code]));
    if (!exists) {
      setActiveCodes((prev) => [code, ...prev.filter((c) => c !== code)]);
    }
    showToast(exists ? `${code} убрана из избранного` : `${code} в избранном и поднята наверх`);
  };

  // ---------- Перетаскивание карточек: зажать карточку и тянуть вверх или вниз ----------
  // Пока палец двигается, React ничего не перерисовывает: карточки сдвигаются напрямую через CSS-transform
  // (это быстро, 60 кадров в секунду). Новый порядок сохраняется один раз — когда палец отпущен.
  const LONG_PRESS_MS = 350;
  const SHIFT_ANIMATION = 'transform 160ms cubic-bezier(0.2, 0, 0, 1)';
  const cardRefs = useRef({}); // код валюты → DOM-элемент карточки
  const visibleCodesRef = useRef([]); // текущий порядок видимых карточек
  const pressRef = useRef(null); // ожидание долгого нажатия
  const dragRef = useRef(null); // данные активного перетаскивания
  const pendingResetRef = useRef(null); // карточки, у которых надо сбросить сдвиг после сохранения порядка
  const suppressClickRef = useRef(false); // чтобы отпускание после перетаскивания не меняло базовую валюту
  const [draggingCode, setDraggingCode] = useState(null);

  const clearPress = () => {
    if (pressRef.current) {
      clearTimeout(pressRef.current.timer);
      pressRef.current = null;
    }
  };

  const resetCardStyles = (items) => {
    items.forEach(({ el }) => {
      el.style.transition = '';
      el.style.transform = '';
      el.style.willChange = '';
    });
  };

  // Сдвигает перетаскиваемую карточку за пальцем и раздвигает остальные
  const updateDrag = () => {
    const d = dragRef.current;
    if (!d) return;
    const scrollDelta = window.scrollY - d.startScroll;
    const dy = d.y - d.startY + scrollDelta;
    d.draggedEl.style.transform = `translate3d(0, ${dy}px, 0)`;

    // Центр перетаскиваемой карточки в координатах страницы
    const from = d.fromIndex;
    const center = d.items[from].top + d.items[from].height / 2 + dy;
    let to = from;
    for (let i = 0; i < from; i++) {
      if (center < d.items[i].top + d.items[i].height / 2) {
        to = i;
        break;
      }
    }
    for (let i = d.items.length - 1; i > from; i--) {
      if (center > d.items[i].top + d.items[i].height / 2) {
        to = i;
        break;
      }
    }
    if (to === d.toIndex) return;
    d.toIndex = to;

    // Соседние карточки плавно уступают место
    d.items.forEach((item, i) => {
      if (i === from) return;
      let shift = 0;
      if (from < to && i > from && i <= to) shift = -d.step;
      if (to < from && i >= to && i < from) shift = d.step;
      item.el.style.transform = shift ? `translate3d(0, ${shift}px, 0)` : '';
    });
    try {
      navigator.vibrate?.(5);
    } catch {
      // Вибрация не поддерживается
    }
  };

  const startDrag = (code, y) => {
    const codes = visibleCodesRef.current;
    const items = codes
      .map((c) => cardRefs.current[c])
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + window.scrollY, height: r.height, left: r.left };
      });
    const fromIndex = codes.indexOf(code);
    if (fromIndex === -1 || items.length !== codes.length) return;
    // Перетаскивание рассчитано на список в одну колонку (на телефоне он всегда такой)
    if (items.some((it) => Math.abs(it.left - items[0].left) > 2)) return;

    const gap = items.length > 1 ? items[1].top - (items[0].top + items[0].height) : 0;
    const draggedEl = items[fromIndex].el;
    items.forEach(({ el }) => {
      el.style.willChange = 'transform';
      el.style.transition = el === draggedEl ? 'none' : SHIFT_ANIMATION;
    });
    dragRef.current = {
      code,
      codes,
      items,
      draggedEl,
      fromIndex,
      toIndex: fromIndex,
      step: items[fromIndex].height + gap,
      startY: y,
      y,
      startScroll: window.scrollY
    };
    suppressClickRef.current = true;
    setDraggingCode(code);
    try {
      navigator.vibrate?.(15);
    } catch {
      // Вибрация не поддерживается
    }
  };

  const handleCardPointerDown = (e, code) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('button')) return; // кнопки копирования, избранного и удаления работают как раньше
    clearPress();
    const x = e.clientX;
    const y = e.clientY;
    pressRef.current = {
      x,
      y,
      timer: setTimeout(() => {
        pressRef.current = null;
        startDrag(code, y);
      }, LONG_PRESS_MS)
    };
  };

  // Если палец сдвинулся до срабатывания долгого нажатия — это прокрутка, а не перетаскивание
  const handleCardPointerMove = (e) => {
    const p = pressRef.current;
    if (!p) return;
    if (Math.abs(e.clientX - p.x) > 8 || Math.abs(e.clientY - p.y) > 8) clearPress();
  };

  // Палец отпущен: карточка плавно встаёт на новое место, затем сохраняется порядок
  const finishDrag = () => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    const { items, fromIndex: from, toIndex: to, draggedEl } = d;

    let finalOffset = 0;
    if (to > from) finalOffset = items[to].top + items[to].height - (items[from].top + items[from].height);
    if (to < from) finalOffset = items[to].top - items[from].top;
    draggedEl.style.transition = SHIFT_ANIMATION;
    draggedEl.style.transform = `translate3d(0, ${finalOffset}px, 0)`;

    setTimeout(() => {
      setDraggingCode(null);
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 50);
      if (to === from) {
        resetCardStyles(items);
        return;
      }
      const newVisible = [...d.codes];
      newVisible.splice(from, 1);
      newVisible.splice(to, 0, d.code);
      pendingResetRef.current = items;
      setActiveCodes((prev) => {
        // Базовая валюта остаётся на своём месте в общем списке
        const next = [...newVisible];
        const baseIndex = prev.indexOf(baseCurrency);
        if (baseIndex !== -1) next.splice(Math.min(baseIndex, next.length), 0, baseCurrency);
        return next;
      });
    }, 170);
  };

  // Пока идёт перетаскивание: следим за пальцем, блокируем прокрутку страницы и прокручиваем у краёв экрана
  useEffect(() => {
    if (!draggingCode) return undefined;
    let raf = 0;

    const onTouchMove = (e) => {
      if (dragRef.current && e.cancelable) e.preventDefault();
    };
    const onPointerMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      d.y = e.clientY;
      updateDrag();
    };
    const autoScroll = () => {
      const d = dragRef.current;
      if (d) {
        const edge = 90;
        const h = window.innerHeight;
        let speed = 0;
        if (d.y < edge) speed = -Math.ceil((edge - d.y) / 6);
        else if (d.y > h - edge) speed = Math.ceil((d.y - (h - edge)) / 6);
        if (speed) {
          window.scrollBy(0, speed);
          updateDrag();
        }
      }
      raf = requestAnimationFrame(autoScroll);
    };

    raf = requestAnimationFrame(autoScroll);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingCode]);

  // Новый порядок уже на экране — убираем временные сдвиги до того, как кадр будет показан (без мигания)
  useLayoutEffect(() => {
    if (pendingResetRef.current) {
      resetCardStyles(pendingResetRef.current);
      pendingResetRef.current = null;
    }
  }, [activeCodes]);

  // Удаление валюты из активного списка
  const removeCurrency = (e, code) => {
    e.stopPropagation();
    setActiveCodes((prev) => prev.filter((c) => c !== code));
    showToast(`${code} убрана из списка`);
  };

  // Копирование итоговой суммы в буфер обмена
  const copyConvertedValue = async (e, code, formattedValue) => {
    e.stopPropagation();
    const cleanCopy = formattedValue.replace(/\u00A0/g, ' ');
    try {
      await navigator.clipboard.writeText(cleanCopy);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cleanCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedCode(code);
    showToast(`Скопировано: ${cleanCopy} ${code}`);
    setTimeout(() => setCopiedCode(null), 1600);
  };

  // Выбор или переключение валюты в модальном окне
  const handleToggleCurrencyInModal = (code) => {
    if (modalMode === 'selectBase') {
      handleSelectBaseCurrency(code);
      setModalMode(null);
      setSearchQuery('');
      return;
    }

    if (code === baseCurrency) return;

    setActiveCodes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      showToast(`Добавлена валюта ${code}`);
      return [...prev, code];
    });
  };

  // Список карточек валют в порядке, который задал пользователь
  const displayedCurrencies = useMemo(() => {
    return activeCodes
      .filter((code) => code !== baseCurrency)
      .map((code) => CURRENCIES_CATALOG.find((c) => c.code === code))
      .filter(Boolean);
  }, [activeCodes, baseCurrency]);
  visibleCodesRef.current = displayedCurrencies.map((c) => c.code);

  // Поиск валют в модальном окне по коду, стране и русскому названию
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CURRENCIES_CATALOG.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0B0D13] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-indigo-500/20">
        {/* Деликатное фоновое свечение */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[620px] h-[280px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl" />
          <div className="absolute top-64 right-1/4 w-[360px] h-[360px] rounded-full bg-emerald-400/5 dark:bg-sky-500/10 blur-3xl" />
        </div>

        {/* Основной контейнер */}
        <div className="relative max-w-4xl mx-auto px-3.5 sm:px-6 py-3 sm:py-4">
          {/* КОМПАКТНАЯ ШАПКА */}
          <header className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm shrink-0">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                <h1 className="text-sm sm:text-base font-semibold tracking-tight leading-none">
                  Конвертер валют
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Wifi className="w-3 h-3" />
                      <span>Актуально{lastUpdated ? ` • ${lastUpdated}` : ''}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <WifiOff className="w-3 h-3" />
                      <span>Резервный курс</span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => fetchExchangeRates(true)}
                disabled={isLoadingRates}
                title="Обновить курсы валют"
                className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-[#151822] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:shadow-sm active:scale-95 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin text-indigo-500' : ''}`} />
              </button>

              <button
                onClick={() => setDarkMode((d) => !d)}
                title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
                className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-[#151822] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:shadow-sm active:scale-95 transition-all"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </header>

          {/* КОМПАКТНЫЙ БЛОК БАЗОВОЙ ВАЛЮТЫ */}
          <section className="rounded-2xl bg-white dark:bg-[#151822] border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] px-3 py-2.5 sm:px-4 sm:py-3 mb-3 transition-all">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {/* Выбор базовой валюты */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setModalMode('selectBase');
                }}
                title="Выбрать базовую валюту"
                className="group flex items-center gap-2.5 px-2 py-1 -ml-1 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all text-left shrink-0"
              >
                <CurrencyAvatar code={baseCurrency} size={34} />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                      {baseCurrency}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[105px] sm:max-w-[180px]">
                    {baseCurrencyMeta.name}
                  </p>
                </div>
              </button>

              {/* Чистое поле ввода суммы с автоформатированием */}
              <div className="relative flex-1 flex items-center justify-end bg-slate-50 dark:bg-[#0E1018] rounded-xl px-3 py-1.5 border border-slate-200/60 dark:border-white/5 focus-within:border-indigo-500/50 transition-colors">
                <span className="text-base sm:text-lg font-medium text-slate-400 dark:text-slate-500 mr-1.5 select-none">
                  {baseCurrencyMeta.symbol}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  value={rawAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  aria-label="Сумма в базовой валюте"
                  className="w-full bg-transparent text-right text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none"
                />
                {rawAmount && (
                  <button
                    onClick={() => {
                      setRawAmount('');
                      inputRef.current?.focus();
                    }}
                    title="Очистить сумму"
                    className="ml-1.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setShowQuickAmounts((v) => !v)}
                  title={showQuickAmounts ? 'Скрыть быстрые суммы' : 'Показать быстрые суммы'}
                  className={`ml-1 p-1 rounded-lg transition-colors shrink-0 ${
                    showQuickAmounts
                      ? 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10'
                      : 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/15'
                  }`}
                >
                  {showQuickAmounts ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Сворачиваемый компактный ряд быстрых сумм без лишних элементов */}
            {showQuickAmounts && (
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {QUICK_AMOUNTS.map((preset) => {
                    const isSelected = numericAmount === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleQuickAmount(preset)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium tabular-nums transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
                        }`}
                      >
                        {formatDisplayAmount(preset, 0)}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowQuickAmounts(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
                >
                  Скрыть
                </button>
              </div>
            )}
          </section>

          {/* ПАНЕЛЬ УПРАВЛЕНИЯ СПИСКОМ ВАЛЮТ */}
          <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                Валюты ({displayedCurrencies.length})
              </h2>
              <button
                onClick={() => setInverseRateView((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors tabular-nums"
                title="Переключить направление справочного курса"
              >
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>{inverseRateView ? `1 X = ${baseCurrency}` : `1 ${baseCurrency} = X`}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Переключатель сетка / список */}
              <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-[#151822] border border-transparent dark:border-white/5">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Две колонки"
                  className={`p-1 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="Список в одну колонку"
                  className={`p-1 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Кнопка добавления валюты */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setModalMode('add');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить валюту</span>
              </button>
            </div>
          </div>

          {/* СПИСОК ОТОБРАЖАЕМЫХ ВАЛЮТ */}
          {displayedCurrencies.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#151822] border border-dashed border-slate-300 dark:border-white/10 p-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Список валют пуст. Добавьте нужные валюты для мгновенного сравнения.
              </p>
              <button
                onClick={() => setModalMode('add')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Добавить валюту
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-2'
                  : 'flex flex-col gap-1.5'
              }
            >
              {displayedCurrencies.map((currency) => {
                const isDragging = draggingCode === currency.code;
                const directRate = getCrossRate(baseCurrency, currency.code);
                const reverseRate = getCrossRate(currency.code, baseCurrency);
                const convertedAmount = numericAmount * directRate;
                const formattedConverted = formatDisplayAmount(
                  convertedAmount,
                  currency.decimals || 2
                );
                const isPinned = pinnedCodes.includes(currency.code);
                const isCopied = copiedCode === currency.code;

                // Адаптивный размер шрифта для длинных и очень больших сумм
                const amountLength = formattedConverted.length;
                const amountSizeClass =
                  amountLength > 16
                    ? 'text-xs sm:text-sm'
                    : amountLength > 12
                    ? 'text-sm sm:text-base'
                    : 'text-base sm:text-lg';

                const rateSubtitle = inverseRateView
                  ? `1 ${currency.code} = ${formatDisplayAmount(reverseRate, 4)} ${baseCurrency}`
                  : `1 ${baseCurrency} = ${formatDisplayAmount(directRate, 4)} ${currency.code}`;

                return (
                  <div
                    key={currency.code}
                    ref={(el) => {
                      if (el) cardRefs.current[currency.code] = el;
                      else delete cardRefs.current[currency.code];
                    }}
                    onPointerDown={(e) => handleCardPointerDown(e, currency.code)}
                    onPointerMove={handleCardPointerMove}
                    onPointerUp={clearPress}
                    onPointerCancel={clearPress}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => {
                      if (suppressClickRef.current) return;
                      handleSelectBaseCurrency(currency.code);
                    }}
                    role="button"
                    tabIndex={0}
                    title={`Сделать ${currency.code} базовой валютой. Зажмите, чтобы перетащить`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectBaseCurrency(currency.code);
                      }
                    }}
                    style={{ WebkitTouchCallout: 'none' }}
                    className={`group relative rounded-2xl bg-white dark:bg-[#151822] border px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2 select-none cursor-pointer ${
                      isDragging
                        ? 'z-30 shadow-lg shadow-slate-900/15 dark:shadow-black/50 ring-2 ring-indigo-500/50'
                        : 'transition-all duration-150 hover:shadow-md dark:hover:shadow-black/30 active:scale-[0.995]'
                    } ${
                      isPinned
                        ? 'border-indigo-500/30 dark:border-indigo-400/25 ring-1 ring-indigo-500/10'
                        : 'border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    {/* Левая часть: векторный флаг, код и название */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CurrencyAvatar code={currency.code} size={32} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm sm:text-[15px] tracking-tight text-slate-900 dark:text-white leading-tight">
                            {currency.code}
                          </span>
                          {isPinned && (
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                          {currency.category === 'crypto' && (
                            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              Crypto
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                          {currency.name}
                        </p>
                      </div>
                    </div>

                    {/* Правая часть: итоговая сумма, справочный курс и быстрые действия */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <div className="text-right">
                        <div
                          className={`font-bold tracking-tight tabular-nums text-slate-900 dark:text-white leading-tight ${amountSizeClass}`}
                        >
                          <span className="text-slate-400 dark:text-slate-500 font-normal text-xs mr-1">
                            {currency.symbol}
                          </span>
                          {formattedConverted}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 tabular-nums leading-tight mt-0.5">
                          {rateSubtitle}
                        </p>
                      </div>

                      {/* Кнопки действий (Избранное, Копировать, Удалить) */}
                      <div className={`flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity pl-1 border-l border-slate-100 dark:border-white/5`}>
                        <button
                          onClick={(e) => copyConvertedValue(e, currency.code, formattedConverted)}
                          title="Скопировать сумму"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => togglePin(e, currency.code)}
                          title={isPinned ? 'Убрать из избранного' : 'Закрепить в избранном'}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
                            isPinned
                              ? 'text-amber-400'
                              : 'text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => removeCurrency(e, currency.code)}
                          title="Удалить из списка"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Карточка быстрого добавления валюты */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setModalMode('add');
                }}
                className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 px-4 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all min-h-[52px]"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить валюту</span>
              </button>
            </div>
          )}

          {/* Отступ внизу, чтобы последняя карточка не прилипала к краю экрана */}
          <div className="h-6" />
        </div>

        {/* МОДАЛЬНОЕ ОКНО ПОИСКА И ДОБАВЛЕНИЯ / ВЫБОРА ВАЛЮТЫ */}
        {modalMode && (
          <div
            onClick={() => setModalMode(null)}
            className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg bg-white dark:bg-[#161924] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                    {modalMode === 'selectBase'
                      ? 'Выберите базовую валюту'
                      : 'Добавить валюту'}
                  </h3>
                  <button
                    onClick={() => setModalMode(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Мгновенный поиск */}
                <div className="relative mb-2.5">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Код или название (KZT, Евро, Тенге, Дирхам...)"
                    className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-[#0E1018] border border-transparent focus:border-indigo-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Фильтр по типу валюты */}
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: `Все (${CURRENCIES_CATALOG.length})` },
                    { id: 'fiat', label: 'Мировые' },
                    { id: 'crypto', label: 'Криптовалюты' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        categoryFilter === tab.id
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Список доступных валют */}
              <div className="overflow-y-auto p-2.5 space-y-1 flex-1">
                {filteredCatalog.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    По запросу «{searchQuery}» ничего не найдено
                  </div>
                ) : (
                  filteredCatalog.map((item) => {
                    const isBase = item.code === baseCurrency;
                    const isSelected = activeCodes.includes(item.code) || isBase;
                    const previewRate = getCrossRate(baseCurrency, item.code);

                    return (
                      <button
                        key={item.code}
                        onClick={() => handleToggleCurrencyInModal(item.code)}
                        disabled={modalMode === 'add' && isBase}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-2xl text-left transition-all ${
                          modalMode === 'add' && isBase
                            ? 'opacity-50 cursor-default'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CurrencyAvatar code={item.code} size={34} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                {item.code}
                              </span>
                              <span className="text-xs text-slate-400">{item.symbol}</span>
                              {isBase && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                  Базовая
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {item.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {!isBase && (
                            <span className="text-xs text-slate-400 tabular-nums hidden sm:inline">
                              1 {baseCurrency} = {formatDisplayAmount(previewRate, 4)} {item.code}
                            </span>
                          )}

                          {modalMode === 'add' ? (
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'border border-slate-300 dark:border-white/20 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            isBase && <Check className="w-4 h-4 text-indigo-500" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {modalMode === 'add' && (
                <div className="p-3.5 border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-[#12151E]">
                  <button
                    onClick={() => setModalMode(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-95 transition-opacity"
                  >
                    Готово
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ВСПЛЫВАЮЩЕЕ МИКРО-УВЕДОМЛЕНИЕ */}
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 ${
            toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {toastMessage && (
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-xl flex items-center gap-2 tabular-nums">
              <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
