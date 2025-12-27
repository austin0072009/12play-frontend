type RawBanner = { id?: number; path?: string; jumpurl?: string };
type RawNotice = {
    activity_id?: any;
    title?: string;
    content?: string;
    id?: any;
    m_img?: string;
    width?: number;
    repeat_tan?: any;
    is_tan?: any;
    type?: any;
};
type RawGame = {
    maintain?: any;
    img?: string;
    m_img?: string;
    productCode?: any;
    productType?: any;
    tcgGameCode?: any;
    gameName?: string;
    gameType?: string;
    is_cate?: any;
    is_outopen?: any;
    is_ios_outopen?: any;
    bind_gid?: any;
    is_show?: any;
    sort?: any;
    is_rec?: any;
};

export interface Notice {
    id: number;
    title: string;
    content: string;
    activityId?: any;
    img?: string;
    width?: number;
    repeat_tan?: number;
    tan?: number;
    type?: any;
}

export function normalizeInitData(raw: any) {
    const domain = raw && raw.domain ? String(raw.domain) : "";
    const banners = Array.isArray(raw && raw.banners)
        ? raw.banners.map(function (el: RawBanner) {
            return {
                id: el && el.id ? el.id : undefined,
                img: el && el.path ? domain + el.path : "",
                href: el && el.jumpurl ? el.jumpurl : "",
            };
        })
        : [];

    const notices: Notice[] = Array.isArray(raw && raw.gonggao)
        ? raw.gonggao.map(function (el: RawNotice): Notice {
            const mimg =
                el && el.m_img
                    ? el.m_img.indexOf("http") === 0
                        ? el.m_img
                        : domain + el.m_img
                    : "";

            return {
                activityId: el && el.activity_id,
                title: el && el.title ? el.title : "",
                content: el && el.content ? el.content : "",
                id: el && el.id,
                img: mimg,
                width: el && el.width,
                repeat_tan: el && el.repeat_tan,
                tan: el && el.is_tan,
                type: el && el.type,
            };
        })
        : [];

    const hotGames = Array.isArray(raw && raw.tj_games) ? raw.tj_games : [];
    const games = Array.isArray(raw && raw.games) ? raw.games : [];
    const hotGames2 = Array.isArray(raw && raw.hot_games) ? raw.hot_games : [];

    const mapGame = function (el: RawGame, isHot: boolean) {
        // For m_img, prefer m_img but fallback to img if m_img is not available
        const rawMImg = el && el.m_img ? el.m_img : (el && el.img ? el.img : "");
        const mimg = rawMImg ? (rawMImg.indexOf("http") === 0 ? rawMImg : domain + rawMImg) : "";
        
        return {
            id: el && el.bind_gid,
            maintain: el && el.maintain,
            img: el && el.img ? domain + el.img : "",
            m_img: mimg,
            plat_type: el && el.productCode,
            game_type: el && el.productType,
            game_code: el && el.tcgGameCode,
            game_name: el && el.gameName,
            rel_game_type: el && el.gameType,
            level: el && el.is_cate,
            is_outopen: el && el.is_outopen,
            ios_outer: el && el.is_ios_outopen,
            gameType: isHot ? "hot" : el && el.gameType ? el.gameType : "",
            is_show: el && el.is_show,
            sort: el && el.sort,
            is_rec: el && el.is_rec,
            is_cate: el && el.is_cate,
        };
    };

    // Special mapping for tj_games and hot_games which have a different structure (id instead of bind_gid)
    const mapTjHotGame = function (el: any) {
        const rawMImg = el && el.m_img ? el.m_img : (el && el.img ? el.img : "");
        const mimg = rawMImg ? (rawMImg.indexOf("http") === 0 ? rawMImg : domain + rawMImg) : "";
        
        return {
            id: el && el.id,  // Direct id field
            maintain: el && el.maintain,
            img: el && el.img ? domain + el.img : "",
            m_img: mimg,
            plat_type: el && el.productCode,
            game_type: el && el.productType,
            game_code: el && el.tcgGameCode,
            game_name: el && el.gameName,
            rel_game_type: el && el.gameType,
            level: el && el.is_cate,
            is_outopen: el && el.is_outopen,
            ios_outer: el && el.is_ios_outopen,
            gameType: "hot",
            is_show: el && el.is_show,
            sort: el && el.sort,
            is_rec: el && el.is_rec,
            is_cate: el && el.is_cate,
            view_count: el && el.view_count,
        };
    };

    const gameList = games.map(function (g: RawGame) {
        return mapGame(g, false);
    });

    // 联系方式
    const sys = raw && raw.sysconfig ? raw.sysconfig : {};
    // 你的老代码还构建了 agent contact & serviceList，这里只把关键字段存起来，其它映射到 UI 时再定制
    const contacts = [
        {
            icon: "airplane.png",
            titleKey: "service.tips6",
            content: sys.agent_airplane,
        },
        { icon: "skype.png", titleKey: "service.tips7", content: sys.agent_skype },
    ];

    const serviceList: Record<string, any> = {};

    ["service_link", "service_link1", "channel_link", "channel_link1"].forEach(
        (key) => {
            if (sys[key]) {
                serviceList[key] = sys[key];
            }
        }
    );

    return {
        domain: domain,
        banners: banners,
        notices: notices,
        games: gameList,
        sysconfig: sys,
        contacts: contacts,
        serviceList: serviceList,
        cate: Array.isArray(raw && raw.cate) ? raw.cate : [],
        tj_games: hotGames.map(function (g: any) {
            return mapTjHotGame(g);
        }),
        hot_games: hotGames2.map(function (g: any) {
            return mapTjHotGame(g);
        }),
    };
}
