import React from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { SearchBar } from '../components/history/SearchBar'
import { DumpGrid } from '../components/history/DumpGrid'
import { useDumps } from '../hooks/useDumps'

export const HistoryPage: React.FC = () => {
  const { dumps, loading, searchDumps, fetchDumps } = useDumps()

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await fetchDumps()
      return
    }

    await searchDumps(searchTerm)
  }

  return (
    <AppLayout showRightSidebar={false}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-base text-[#737373] mb-6">
            Browse and search through all your brain dumps
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Dumps Grid */}
        <DumpGrid dumps={dumps} loading={loading} />
      </div>
    </AppLayout>
  )
}
