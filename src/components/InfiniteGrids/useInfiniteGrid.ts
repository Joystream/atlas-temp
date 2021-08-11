import { ApolloError, useQuery } from '@apollo/client'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { DocumentNode } from 'graphql'
import { debounce, isEqual } from 'lodash'
import { useEffect, useRef } from 'react'

import { ChannelEdge, ChannelOrderByInput, VideoEdge } from '@/api/queries'

export type PaginatedData<T> = {
  edges: {
    cursor: string
    node: T
  }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor?: string | null
  }
  totalCount: number
}
export type PaginatedDataArgs = {
  first?: number | null
  after?: string | null
}

// TODO these types below could be used to get rid of requirement to pass TPaginatedData explicitly
// however this currently is not possible because of constraints of Typescript and our GraphQL codegen
// tldr is that our codegen generates interfaces instead of types and a more specific interface cannot be assigned to a generic one

// type RawData<TData> = { [p: string]: PaginatedData<TData> }
// type PaginatedDataFromRawData<TRawData extends RawData<unknown>> = TRawData[keyof TRawData]
// type ItemTypeFromRawData<TRawData extends RawData<unknown>> = PaginatedDataFromRawData<TRawData>['edges'][0]['node']

type UseInfiniteGridParams<TRawData, TPaginatedData extends PaginatedData<unknown>, TArgs> = {
  query: DocumentNode | TypedDocumentNode<TRawData, TArgs>
  dataAccessor: (rawData?: TRawData) => TPaginatedData | undefined
  isReady: boolean
  targetRowsCount: number
  itemsPerRow: number
  skipCount: number
  queryVariables: TArgs
  onDemand?: boolean
  onScrollToBottom?: () => void
  orderBy?: ChannelOrderByInput
  sortByViews?: boolean
  additionalSortFn?: (edge?: ChannelEdge[] | VideoEdge[]) => (ChannelEdge | VideoEdge)[]
}

type UseInfiniteGridReturn<TPaginatedData extends PaginatedData<unknown>> = {
  displayedItems: TPaginatedData['edges'][0]['node'][]
  placeholdersCount: number
  error?: ApolloError
  allItemsLoaded: boolean
  loading: boolean
  totalCount: number
}

export const useInfiniteGrid = <
  TRawData,
  TPaginatedData extends PaginatedData<unknown>,
  TArgs extends PaginatedDataArgs
>({
  query,
  dataAccessor,
  isReady,
  targetRowsCount,
  itemsPerRow,
  skipCount,
  onScrollToBottom,
  queryVariables,
  onDemand,
  sortByViews,
  orderBy = ChannelOrderByInput.CreatedAtDesc,
  additionalSortFn,
}: UseInfiniteGridParams<TRawData, TPaginatedData, TArgs>): UseInfiniteGridReturn<TPaginatedData> => {
  const targetDisplayedItemsCount = targetRowsCount * itemsPerRow
  const targetLoadedItemsCount = targetDisplayedItemsCount + skipCount

  const queryVariablesRef = useRef(queryVariables)

  const { loading, data: rawData, error, fetchMore, refetch } = useQuery<TRawData, TArgs>(query, {
    notifyOnNetworkStatusChange: true,
    skip: !isReady,
    variables: {
      ...queryVariables,
      orderBy,
      first: sortByViews ? 100 : targetDisplayedItemsCount,
    },
  })

  const data = dataAccessor(rawData)

  const loadedItemsCount = data?.edges.length ?? 0
  const allItemsLoaded = data ? !data.pageInfo.hasNextPage : false
  const endCursor = data?.pageInfo.endCursor

  // handle fetching more items
  useEffect(() => {
    if (loading || !isReady || !fetchMore || allItemsLoaded) {
      return
    }

    const missingItemsCount = targetLoadedItemsCount - loadedItemsCount

    if (missingItemsCount <= 0) {
      return
    }

    fetchMore({
      variables: { ...queryVariables, first: missingItemsCount, after: endCursor },
    })
  }, [loading, fetchMore, allItemsLoaded, queryVariables, targetLoadedItemsCount, loadedItemsCount, endCursor, isReady])

  useEffect(() => {
    if (!isEqual(queryVariablesRef.current, queryVariables)) {
      queryVariablesRef.current = queryVariables
      refetch()
    }
  }, [queryVariables, refetch])

  // handle scroll to bottom
  useEffect(() => {
    if (onDemand) {
      return
    }
    const scrollHandler = debounce(() => {
      const scrolledToBottom =
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight
      if (onScrollToBottom && scrolledToBottom && isReady && !loading && !allItemsLoaded) {
        onScrollToBottom()
      }
    }, 100)

    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [isReady, loading, allItemsLoaded, onScrollToBottom, onDemand])

  const edges = additionalSortFn ? additionalSortFn(data?.edges as ChannelEdge[] | VideoEdge[]) : data?.edges

  const displayedEdges = edges?.slice(skipCount, targetLoadedItemsCount) ?? []
  const displayedItems = displayedEdges.map((edge) => edge.node)

  const displayedItemsCount = data
    ? Math.min(targetDisplayedItemsCount, data.totalCount - skipCount)
    : targetDisplayedItemsCount
  const placeholdersCount = displayedItemsCount - displayedItems.length

  return {
    displayedItems,
    placeholdersCount,
    allItemsLoaded,
    error,
    loading,
    totalCount: data?.totalCount || 0,
  }
}
