import { resolver } from "blitz"
import {
  Id,
  PageService,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "integrations/domain"
import { UserLikeQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetUserLikesInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserLikesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const userLikeQuery = new UserLikeQuery()

    const likes = await userLikeQuery.findMany({ skip, take, userId, username })

    const count = await userLikeQuery.count({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = likes.length === 0

    return { count, likes, nextPage, hasMore, isEmpty }
  }
)
