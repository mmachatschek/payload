import type { LinkFeatureProps } from '.'
import type { PopulationPromise } from '../types'
import type { SerializedLinkNode } from './nodes/LinkNode'

import { populate } from '../../../populate/populate'
import { recurseNestedFields } from '../../../populate/recurseNestedFields'

export const linkPopulationPromiseHOC = (
  props: LinkFeatureProps,
): PopulationPromise<SerializedLinkNode> => {
  const linkPopulationPromise: PopulationPromise<SerializedLinkNode> = ({
    context,
    currentDepth,
    depth,
    editorPopulationPromises,
    field,
    findMany,
    flattenLocales,
    node,
    overrideAccess,
    populationPromises,
    req,
    showHiddenFields,
    siblingDoc,
  }) => {
    const promises: Promise<void>[] = []

    if (node?.fields?.doc?.value?.id && node?.fields?.doc?.relationTo) {
      const collection = req.payload.collections[node?.fields?.doc?.relationTo]

      if (collection) {
        promises.push(
          populate({
            id: node?.fields?.doc?.value?.id,
            collection,
            currentDepth,
            data: node?.fields?.doc,
            depth,
            field,
            key: 'value',
            overrideAccess,
            req,
            showHiddenFields,
          }),
        )
      }
    }
    if (Array.isArray(props.fields)) {
      recurseNestedFields({
        context,
        currentDepth,
        data: node.fields || {},
        depth,
        editorPopulationPromises,
        fields: props.fields,
        findMany,
        flattenLocales,
        overrideAccess,
        populationPromises,
        promises,
        req,
        showHiddenFields,
        siblingDoc: node.fields || {},
      })
    }
    return promises
  }

  return linkPopulationPromise
}
