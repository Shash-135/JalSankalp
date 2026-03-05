import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const SearchInput = ({ placeholder }) => {
  return (
    <label className="relative block">
      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
        <HiOutlineSearch className="h-5 w-5" />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-accent"
      />
    </label>
  );
};

export default SearchInput;
