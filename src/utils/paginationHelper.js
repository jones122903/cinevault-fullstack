function getPaginationMeta(total, perPage, currentPage) {
  const lastPage = Math.ceil(total / perPage);
  const from = total == 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;

  return {
    perPage,
    currentPage,
    from: total == 0 ? 0 : from,
    to: total == 0 ? 0 : to,
    total,
    lastPage,
    prevPage,
    nextPage,
  };
}

module.exports = { getPaginationMeta };
