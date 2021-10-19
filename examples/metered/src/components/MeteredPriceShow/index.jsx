import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { usePriceBlocsContext } from '@priceblocs/react-priceblocs-js'
import Breadcrumbs from '@components/Breadcrumbs'
import ReportUsageSimulator from '@components/ReportUsageSimulator'
import Loader from './Loader'
import clone from 'lodash/clone'
import round from 'lodash/round'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Table from './Table'
import { formatAmount } from '@utils/currency'

export const COMPUTATION_HEIGHT = 300

const PriceShow = ({ price, setActivePriceId }) => {
  const {
    fetchUsage,
    values: { products },
  } = usePriceBlocsContext()
  const [page, setPage] = useState(0)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(false)
  const priceId = price.id
  const product = useMemo(
    () =>
      products.find(({ prices }) => prices.find(({ id }) => id === priceId)),
    [priceId, products]
  )

  const subscriptionItem = price.subscription_item

  const getUsage = useCallback(async () => {
    setLoading(true)
    const usageData = await fetchUsage({
      subscription_item: subscriptionItem,
    })

    setUsage(usageData)
    setLoading(false)
  }, [subscriptionItem, fetchUsage])

  const updateUsage = (usageReport) => {
    const updatedUsage = clone(usage)
    updatedUsage.total_usage += usageReport.quantity
    const priceUnitAmount = parseFloat(price.unit_amount_decimal)

    updatedUsage.data[updatedUsage.data.length - 1].total_usage +=
      usageReport.quantity
    updatedUsage.total_cost = formatAmount({
      amount: round(usage.total_usage * priceUnitAmount),
      currency: price.currency,
    })

    updatedUsage.data[updatedUsage.data.length - 1].total_cost = formatAmount({
      amount: round(
        updatedUsage.data[updatedUsage.data.length - 1].total_usage *
          priceUnitAmount
      ),
      currency: price.currency,
    })

    setUsage(updatedUsage)
  }

  useEffect(() => {
    if (!usage && !loading) {
      getUsage()
    }
  }, [usage, loading, subscriptionItem, getUsage])

  let content
  if (loading) {
    content = (
      <div className="p-4" style={{ minHeight: COMPUTATION_HEIGHT }}>
        <Loader groups={1} />
      </div>
    )
  } else if (usage) {
    const chartData = usage.data.map((summary) => ({
      name: summary.period.label,
      usage: summary.total_usage,
    }))
    const chartProps = {
      data: chartData,
      maxBarSize: 100,
      margin: {
        top: 5,
        right: 20,
        left: -10,
        bottom: 20,
      },
    }

    const totalLine = `(${usage.total_usage} units at ${usage.unit_cost} per unit)`
    const statusPill = (
      <p className="px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded bg-yellow-100 text-yellow-600">
        Demo
      </p>
    )

    content = (
      <div className="px-4 pb-5 sm:px-6">
        <div className="px-0 py-3 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-baseline space-y-2">
            <div className="flex flex-row space-x-1 items-baseline">
              <h3 className="text-md sm:text-lg leading-6 font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-1 max-w-2xl text-md sm:text-lg text-gray-900">
                {usage.total_cost}
              </p>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">
                {totalLine}
              </p>
            </div>
            {statusPill}
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className="w-full relative"
            style={{ height: COMPUTATION_HEIGHT }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart {...chartProps}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#5D8BFF" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ReportUsageSimulator
            subscriptionItem={subscriptionItem}
            updateUsage={updateUsage}
          />
          {usage.data && (
            <div className="mt-8">
              <Table
                page={page}
                setPage={setPage}
                summaries={[...usage.data].reverse()}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md border-t border-gray-200">
      <div className="text-lg">
        <div className="pt-4 px-4">
          <Breadcrumbs
            onClickRoot={() => setActivePriceId(null)}
            steps={[
              {
                name: product.name,
              },
            ]}
          />
        </div>
      </div>
      {content}
    </div>
  )
}

export default PriceShow
