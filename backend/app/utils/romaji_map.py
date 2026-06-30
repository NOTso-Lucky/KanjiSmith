# Longest romaji token length
MAX_TOKEN_LENGTH = max(len(k) for k in ROMAJI_MAP)

# Consonants that can be doubled (small っ)
DOUBLE_CONSONANTS = set("bcdfghjklmpqrstvwxyz") - {"n"}

# Vowels
VOWELS = set("aeiou")

# Basic vowels
ROMAJI_MAP = {
    # Vowels
    "a": "あ",
    "i": "い",
    "u": "う",
    "e": "え",
    "o": "お",

    # K
    "ka": "か",
    "ki": "き",
    "ku": "く",
    "ke": "け",
    "ko": "こ",

    # G
    "ga": "が",
    "gi": "ぎ",
    "gu": "ぐ",
    "ge": "げ",
    "go": "ご",

    # S
    "sa": "さ",
    "shi": "し",
    "su": "す",
    "se": "せ",
    "so": "そ",

    # Z
    "za": "ざ",
    "ji": "じ",
    "zu": "ず",
    "ze": "ぜ",
    "zo": "ぞ",

    # T
    "ta": "た",
    "chi": "ち",
    "tsu": "つ",
    "te": "て",
    "to": "と",

    # D
    "da": "だ",
    "di": "ぢ",
    "du": "づ",
    "de": "で",
    "do": "ど",

    # N
    "na": "な",
    "ni": "に",
    "nu": "ぬ",
    "ne": "ね",
    "no": "の",

    # H
    "ha": "は",
    "hi": "ひ",
    "fu": "ふ",
    "he": "へ",
    "ho": "ほ",

    # B
    "ba": "ば",
    "bi": "び",
    "bu": "ぶ",
    "be": "べ",
    "bo": "ぼ",

    # P
    "pa": "ぱ",
    "pi": "ぴ",
    "pu": "ぷ",
    "pe": "ぺ",
    "po": "ぽ",

    # M
    "ma": "ま",
    "mi": "み",
    "mu": "む",
    "me": "め",
    "mo": "も",

    # Y
    "ya": "や",
    "yu": "ゆ",
    "yo": "よ",

    # R
    "ra": "ら",
    "ri": "り",
    "ru": "る",
    "re": "れ",
    "ro": "ろ",

    # W
    "wa": "わ",
    "wi": "うぃ",
    "we": "うぇ",
    "wo": "を",

    # N
    "n": "ん",

    # -------------------------
    # Yoon (ゃゅょ)
    # -------------------------

    # K
    "kya": "きゃ",
    "kyu": "きゅ",
    "kyo": "きょ",

    # G
    "gya": "ぎゃ",
    "gyu": "ぎゅ",
    "gyo": "ぎょ",

    # S
    "sha": "しゃ",
    "shu": "しゅ",
    "sho": "しょ",

    # Z
    "ja": "じゃ",
    "ju": "じゅ",
    "jo": "じょ",

    # T
    "cha": "ちゃ",
    "chu": "ちゅ",
    "cho": "ちょ",

    # D
    "dya": "ぢゃ",
    "dyu": "ぢゅ",
    "dyo": "ぢょ",

    # N
    "nya": "にゃ",
    "nyu": "にゅ",
    "nyo": "にょ",

    # H
    "hya": "ひゃ",
    "hyu": "ひゅ",
    "hyo": "ひょ",

    # B
    "bya": "びゃ",
    "byu": "びゅ",
    "byo": "びょ",

    # P
    "pya": "ぴゃ",
    "pyu": "ぴゅ",
    "pyo": "ぴょ",

    # M
    "mya": "みゃ",
    "myu": "みゅ",
    "myo": "みょ",

    # R
    "rya": "りゃ",
    "ryu": "りゅ",
    "ryo": "りょ",

    # -------------------------
    # IME aliases
    # -------------------------

    "si": "し",
    "sya": "しゃ",
    "syu": "しゅ",
    "syo": "しょ",

    "ti": "ち",
    "tu": "つ",

    "tya": "ちゃ",
    "tyu": "ちゅ",
    "tyo": "ちょ",

    "zi": "じ",

    "hu": "ふ",

    "cya": "ちゃ",
    "cyu": "ちゅ",
    "cyo": "ちょ",

    "jya": "じゃ",
    "jyu": "じゅ",
    "jyo": "じょ",

    "sha": "しゃ",
    "shu": "しゅ",
    "sho": "しょ",

    "che": "ちぇ",
    "she": "しぇ",
    "je": "じぇ",

    "fa": "ふぁ",
    "fi": "ふぃ",
    "fe": "ふぇ",
    "fo": "ふぉ",

    "va": "ゔぁ",
    "vi": "ゔぃ",
    "vu": "ゔ",
    "ve": "ゔぇ",
    "vo": "ゔぉ",

    "kwa": "くぁ",
    "kwi": "くぃ",
    "kwe": "くぇ",
    "kwo": "くぉ",

    "gwa": "ぐぁ",
    "gwi": "ぐぃ",
    "gwe": "ぐぇ",
    "gwo": "ぐぉ",

    "tsa": "つぁ",
    "tsi": "つぃ",
    "tse": "つぇ",
    "tso": "つぉ",

    "la": "ぁ",
    "li": "ぃ",
    "lu": "ぅ",
    "le": "ぇ",
    "lo": "ぉ",

    "xa": "ぁ",
    "xi": "ぃ",
    "xu": "ぅ",
    "xe": "ぇ",
    "xo": "ぉ",

    "lya": "ゃ",
    "lyu": "ゅ",
    "lyo": "ょ",

    "xya": "ゃ",
    "xyu": "ゅ",
    "xyo": "ょ",

    "ltsu": "っ",
    "xtsu": "っ",

    "lwa": "ゎ",
    "xwa": "ゎ",

    "-": "ー",
}