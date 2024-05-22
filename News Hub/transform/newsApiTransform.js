import { getImageUrl } from "../utils/helper.js";

class NewsApiTransform {
    static transform(news) {
        return {
            id: news.id,
            heading: news.title,
            content: news.content,
            image: getImageUrl(news.image),
            reporter: {
                id: news?.user.id,
                name: news?.user.name,
                profile: news?.user?.profile !== null ? getImageUrl(news?.user?.profile) : null ,
            },
            created_at: news.created_at,
        }
    }
}

export default NewsApiTransform