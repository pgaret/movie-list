import moment from "moment";
import React from "react";
import classNames from 'classnames';
import KEYS from '../../lib/keys';
import TMDBMovie from "../../lib/interfaces";
import styles from "./MovieRow.module.css";

interface IEProps {
	data: TMDBMovie,
	handleSelection: Function
}

function MovieRow({ data, handleSelection }: IEProps) {
	const { id, title, poster_path, overview, release_date, vote_average, watched } = data;
	const { TMDB_API_KEY } = process.env;
	const imgUrl = `https://image.tmdb.org/t/p/original${poster_path}?api_key=${TMDB_API_KEY || KEYS.TMDB}`;
	const overviewWrap = 200;
	const parsedDate = moment(release_date, 'YYYY-MM-DD');
	const titleClass = classNames(styles.tmdb_title, {
		[styles.smol_text]: title.length > 25
	});
	const tmdb_row_watched = classNames(styles.tmdb_row, {
		[styles.tmb_row_watched]: watched
	});
	function handleSelect() {
		handleSelection({ id, title, poster_path, overview, release_date, vote_average, watched: false });
	}
	return (
		<div key={id} className={tmdb_row_watched} onClick={handleSelect}>
			{ poster_path && <img src={imgUrl} className={styles.tmdb_poster} /> }
			<div className={styles.tmdb_data}>
				{ watched && <div>Watched</div> }
				<div className={`${styles.row} ${styles.space_between}`}>
					<div className={titleClass}>{title}</div>
					<div className={`${styles.row} ${styles.meta_data}`}>
						<div className={styles.tmdb_score}>{vote_average}</div>
						<div className={styles.divider}>|</div>
						<div className={styles.tmdb_date}>{parsedDate.format('MMMM Do, YYYY')}</div>
					</div>
				</div>
				<div className={styles.tmdb_overview}>
					{ overview.length > overviewWrap ? overview.slice(0, overviewWrap).trim()+"..." : overview }
				</div>
			</div>
		</div>
	);
}

export default MovieRow;
