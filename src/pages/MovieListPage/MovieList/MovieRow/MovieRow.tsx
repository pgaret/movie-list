import moment from "moment";
import React from "react";
import { Checkbox, CircularProgress, IconButton } from "@material-ui/core";
import AddButton from '@material-ui/icons/Add'
import classNames from 'classnames';
import { TMDBMovie } from "lib/interfaces";
import styles from "./MovieRow.module.scss";

interface MovieRowProps {
	data: TMDBMovie,
	checkbox: MovieRowCheckbox
	handleSelection: Function
	loading?: boolean
}

interface MovieRowCheckbox {
	enabled: boolean,
	selected?: boolean,
	handleClick?: Function
}

function MovieRow({ data, checkbox, loading, handleSelection }: MovieRowProps) {
	const { id, title, poster_path, overview, release_date, vote_average, watched } = data;
	const { REACT_APP_TMDB_API_KEY } = process.env;
	const imgUrl = `https://image.tmdb.org/t/p/original${poster_path}?api_key=${REACT_APP_TMDB_API_KEY}`;
	const overviewWrap = 200;
	const parsedDate = moment(release_date, 'YYYY-MM-DD');

	const tmdb_row_styles = classNames(styles.movieRow, {
		[styles.rowWatched]: watched
	});
	const tmdb_row_header_styles = classNames(styles.row, styles.metaData, styles.fullWidth, styles.spaceBetween);

	function handleAddClick() {
		console.log(data);
		handleSelection(data);
	}

	return (
		<div key={id} className={tmdb_row_styles}>
			{ loading ?
				<div className={styles.loading}>
					<CircularProgress />
				</div>
				: <React.Fragment>
					{ poster_path && <img src={imgUrl} className={styles.tmdbPoster} /> }
					{ checkbox.enabled && (
						<IconButton onClick={handleAddClick} aria-label="delete">
							<AddButton />
						</IconButton>
					) }
					<div className={styles.tmdbData}>
						{ watched && <div>Watched</div> }
						<div className={tmdb_row_header_styles}>
							<div className={styles.tmdbTitle}>{title}</div>
							<div className={`${styles.row} ${styles.metaData}`}>
								<div className={styles.tmdbScore}>{vote_average}</div>
								<div className={styles.divider}>|</div>
								<div className={styles.tmdbDate}>{parsedDate.format('MMMM Do, YYYY')}</div>
							</div>
						</div>
						<div className={styles.tmdbOverview}>
							{ overview.length > overviewWrap ? overview.slice(0, overviewWrap).trim()+"..." : overview }
						</div>
					</div>

				</React.Fragment>
			}
		</div>
	);
}

export default MovieRow;
