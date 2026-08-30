import { useEffect, useState } from "react";
import { DeleteMovie } from "../../services/Index";

import ViewMovie from "./ViewMovie";
import EditMovie from "./EditMovie";
import AddMovie from "./AddMovie";

import Common from "../../common/common";
import MovieCard from "../../components/MovieCard";

import { selectMovie } from "../../features/movie/moviesSlice";
import { useSelector } from "react-redux";

import SearchBar from "../../components/SearchBar";

import "./Movie.css";

const Movies = ({
  viewState,
  editState,
  addState,
}) => {
  const [searchText, setSearchText] =
    useState("");

  const [searchName, setSearchName] =
    useState("");

  const [page, setPage] =
    useState(1);

  const limit = 10;

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [
    targetMovie,
    setTargetMovie,
  ] = useState(null);

  const { movies = [] } =
    useSelector(selectMovie);

  const {
    TokenRefreshedModal,
    fetchMovies,
    showToast,
  } = Common();

  const userRole =
    localStorage.getItem(
      "userRole"
    ) || "guest";

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  const loadMovies = async (
    currentPage = page,
    currentSearch = searchName
  ) => {
    const shouldShowLoading =
      movies.length === 0;

    const result =
      await fetchMovies({
        page: currentPage,
        limit,
        name: currentSearch,

        setLoading:
          shouldShowLoading
            ? setLoading
            : undefined,
      });

    if (result) {
      setTotal(result.total);
    }
  };

  useEffect(() => {
    /*
      Do not refetch the list simply because
      View/Edit/Add is currently open.
    */
    if (
      viewState ||
      editState ||
      addState
    ) {
      return;
    }

    loadMovies(
      page,
      searchName
    );
  }, [
    page,
    searchName,
    viewState,
    editState,
    addState,
  ]);

  const handleSearch = () => {
    const value =
      searchText.trim();

    if (page !== 1) {
      setPage(1);
    }

    setSearchName(value);

    if (
      page === 1 &&
      searchName === value
    ) {
      loadMovies(
        1,
        value
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      const res =
        await DeleteMovie(id);

      if (
        res.status === "success"
      ) {
        showToast({
          message:
            res.message ||
            "Movie deleted successfully",
          type: "success",
        });

        const newTotal =
          Math.max(
            total - 1,
            0
          );

        const newTotalPages =
          Math.max(
            1,
            Math.ceil(
              newTotal / limit
            )
          );

        setTotal(newTotal);

        if (
          page >
          newTotalPages
        ) {
          setPage(
            newTotalPages
          );
        } else {
          await loadMovies(
            page,
            searchName
          );
        }
      }
    } catch (err) {
      console.error(err);

      showToast({
        message:
          err?.response?.data
            ?.message ||
          "Something went wrong",
        type: "error",
      });

      if (
        err?.response?.data
          ?.message ===
        "Token refreshed"
      ) {
        TokenRefreshedModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    setPage((currentPage) =>
      Math.max(
        1,
        currentPage - 1
      )
    );
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(
        totalPages,
        currentPage + 1
      )
    );
  };

  return (
    <div>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        path="/movies/add"
      />

      {loading &&
      movies.length === 0 ? (
        <div className="loading-text">
          Loading...
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="card-container">
            {movies.map(
              (movie) => (
                <div
                  key={movie.id}
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <MovieCard
                    data={movie}
                    setShowConfirm={
                      setShowConfirm
                    }
                    setTargetMovie={
                      setTargetMovie
                    }
                  />

                  {userRole !==
                    "admin" && (
                    <div
                      style={{
                        position:
                          "absolute",
                        top: 0,
                        right: 0,
                        width:
                          "40px",
                        height:
                          "40px",
                        zIndex: 10,
                        background:
                          "white",
                        opacity: 0.8,
                      }}
                    />
                  )}
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: "20px",
              marginTop:
                "30px",
              marginBottom:
                "30px",
            }}
          >
            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                page === 1 ||
                loading
              }
              className="primary-btn"
            >
              Previous
            </button>

            <span>
              Page {page} of{" "}
              {totalPages}
            </span>

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                page >=
                  totalPages ||
                loading
              }
              className="primary-btn"
            >
              Next
            </button>
          </div>

          <div
            style={{
              textAlign:
                "center",
              marginBottom:
                "30px",
            }}
          >
            Total movies:{" "}
            {total}
          </div>

          {showConfirm &&
            targetMovie && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <p>
                    Are you sure you
                    want to delete{" "}
                    <strong>
                      {
                        targetMovie.name
                      }
                    </strong>
                    ?
                  </p>

                  <div
                    style={{
                      marginTop:
                        "12px",
                      display:
                        "flex",
                      gap: "12px",
                      justifyContent:
                        "center",
                    }}
                  >
                    <button
                      onClick={async () => {
                        await handleDelete(
                          targetMovie.id
                        );

                        setShowConfirm(
                          false
                        );

                        setTargetMovie(
                          null
                        );
                      }}
                      className="confirm-btn"
                    >
                      Yes
                    </button>

                    <button
                      onClick={() => {
                        setShowConfirm(
                          false
                        );

                        setTargetMovie(
                          null
                        );
                      }}
                      className="cancel-btn"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
        </>
      ) : (
        <div className="no-data">
          No data available
        </div>
      )}

      {viewState && (
        <ViewMovie />
      )}

      {editState && (
        <EditMovie />
      )}

      {addState && (
        <AddMovie />
      )}
    </div>
  );
};

export default Movies;