import db from "db"
import { ReferenceRepository as Repository } from "integrations/domain/repositories"
import { Id } from "integrations/domain/valueObjects"

export class ReferenceRepository implements Repository {
  async markAsRead(userId: Id) {
    await db.reference.updateMany({
      data: { isRead: true },
      where: {
        userId: userId.value,
        isRead: false,
      },
    })

    return null
  }
}
