/* eslint-disable no-param-reassign */
import type { Response } from 'express'

import type { PayloadRequest } from '../../../express/types'
import type { Collection } from '../../config/types'

import isolateTransactionID from '../../../utilities/isolateTransactionID'
import restoreVersion from '../../operations/restoreVersion'

export type Resolver = (
  _: unknown,
  args: {
    id: number | string
  },
  context: {
    req: PayloadRequest
    res: Response
  },
) => Promise<Document>

export default function restoreVersionResolver(collection: Collection): Resolver {
  async function resolver(_, args, context) {
    const options = {
      id: args.id,
      collection,
      depth: 0,
      req: isolateTransactionID(context.req),
    }

    const result = await restoreVersion(options)
    return result
  }

  return resolver
}
