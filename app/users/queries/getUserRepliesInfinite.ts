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
import { UserReplyQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetUserRepliesInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserRepliesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const userReplyQuery = new UserReplyQuery()

    const posts = await userReplyQuery.findMany({
      skip,
      take,
      userId,
      username,
    })

    const count = await userReplyQuery.count({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = posts.length === 0

    return { count, posts, nextPage, hasMore, isEmpty }
  }
)
