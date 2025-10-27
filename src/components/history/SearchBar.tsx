import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search your dumps...'
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-20 bg-white border border-[#e5e5e5] rounded-lg text-base focus:outline-none focus:border-black transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-14 top-1/2 -translate-y-1/2 text-[#737373] hover:text-black"
        >
          ×
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-[#333] transition-colors"
      >
        Search
      </button>
    </form>
  )
}
