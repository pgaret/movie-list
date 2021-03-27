import moment from "moment";
import React from "react";
import { Checkbox, CircularProgress, IconButton } from "@material-ui/core";
import AddButton from '@material-ui/icons/Add'
import CheckButton from '@material-ui/icons/Check'
import classNames from 'classnames';
import { TMDBMovie } from "lib/interfaces";
import styles from "./MovieRow.module.scss";

interface MovieRowProps {
	data: TMDBMovie,
	action: MovieRowAction
	handleSelection: Function
	loading: boolean,
}

interface MovieRowAction {
	enabled: boolean
	actionType: string
}

function MovieRow({ data, action, loading, handleSelection }: MovieRowProps) {
	const { id, title, poster_path, overview, release_date, vote_average, watched } = data;
	const imgUrl = `https://image.tmdb.org/t/p/original${poster_path}`;
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
					{ action.enabled && (
						<IconButton onClick={handleAddClick} disabled={watched} aria-label="action">
							{ action.actionType === 'Add' && <AddButton /> }
							{ action.actionType === 'Check' && <CheckButton /> }
						</IconButton>
					) }
					{ poster_path && <img src={imgUrl} className={styles.tmdbPoster} /> }
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
