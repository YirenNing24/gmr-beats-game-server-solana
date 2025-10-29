//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";


export const cardGiftSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        cardName: t.String(), 
        id: t.String(), 
        receiver: t.String() })
}


export const postsFanMomentSchema = {
	headers: t.Object({ authorization: t.String() }),
	body: t.Object({
		userName: t?.String(),
        postId: t?.String(),
		caption: t?.String(),
		image: t.Optional(t.String()),
		createdAt: t.Optional(t.Number()),
		likes: t.Optional(t.Array(
			t.Object({
				userName: t.Optional(t.String()),
				timestamp: t.Optional(t.Number()),
				likeId: t?.String()
			})
		)),
		shares: t.Optional(t.Array(
			t.Object({
				userName: t.Optional(t.String()),
				timestamp: t.Optional(t.Number()),
				shareId: t?.String()
			})
		)),
		comments: t.Optional(t.Array(
			t.Object({
				userName: t.Optional(t.String()),
				timestamp: t.Optional(t.Number()),
				commentId: t.String(),
				comment: t?.String()
			})
		)),
		
	})
};

export const postFanMomentSchema = {
	headers: t.Object({ authorization: t.String() }),
	body: t.Object({
		caption: t?.String(),
		image: t.String()
	})
};

export const likeFanMomentSchema= {
	headers: t.Object({ authorization: t.String() }),
	body: t.Object({ _id: t.String()

	})
};
export const commentFanMomentSchema= {
	headers: t.Object({ authorization: t.String() }),
	body: t.Object({ 
		_id: t.String(),
		comment: t.String()
	})
};


export const getFanMomentSchema= {
	headers: t.Object({ authorization: t.String() }),
	query: t.Object({ 
		limit: t.String(),
		offset: t.String()
	})
};

export const getFollowersFollowingSchema= {
	headers: t.Object({ authorization: t.String() }),
    params: t.Object({ 
        username: t.String(),
    })
};


export const getBeatsClientStatusSchema = {
	headers: t.Object({ authorization: t.String() }),
    body: t.Array(t.String())
};


export const saveStalkerSchema = {
	headers: t.Object({ authorization: t.String() }),
	body: t.Object({ 
		username: t.String(),

	})
};



