'use client';

import { useEffect, useState } from 'react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const articlesPerPage = 9;

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      handleFilter();
    }, 400);

    setSearchTimeout(timeout);
  }, [searchQuery, category]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('https://test-fe.mysellerpintar.com/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
      });

      if (!res.ok) {
        throw new Error('Gagal fetch data');
      }

      const data = await res.json();
      // console.log (data)
      setArticles(data.data || []);
      setFilteredArticles(data.data || []);
    } catch (err) {
      console.error('Error fetching articles:', err instanceof Error ? err.message : err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...articles];

    if (searchQuery) {
      filtered = filtered.filter(article =>
        (article.name?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(article => article.category === category);
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  console.log("currentArticles: ", currentArticles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-16 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Artikel Kami</h1>
        <p className="text-lg mb-8">Temukan berbagai artikel menarik di sini</p>

        {/* Search and Filter dalam Banner */}
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-3xl mx-auto">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full md:w-1/3 px-4 py-2 border rounded text-black"
          >
            <option value="">Semua Kategori</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Hiburan">Hiburan</option>
          </select>

          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-2/3 px-4 py-2 border rounded text-black"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* List Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {currentArticles.length > 0 ? (
            currentArticles.map((article: any) => (
              <div key={article.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h2 className="text-2xl font-bold mb-2">{article.name?.name || 'Tanpa Judul'}</h2>
                <p className="text-gray-600 mb-4">{article.category || 'Tidak ada kategori'}</p>
                <button className="text-blue-600 hover:underline">Lihat Detail</button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">Tidak ada artikel ditemukan.</p>
          )} */}
          <div>

          {articles.map((article) => (
          
            <p key={article.id} className="text-black">Ttitle: {article.title}</p>
            
            
          ))}
          </div>
          
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
