import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
	constructor(props){
		super(props);

		const album = albumData.find( album => {
			return album.slug === this.props.match.params.slug
		});

		this.state = {
			album: album,
			currentSong: album.songs[0],
			isPlaying: false,
			hoverVal: 0
		};

		this.audioElement = document.createElement('audio');
		this.audioElement.src = album.songs[0].audioSrc;
		this.playIcon = 'icon ion-md-play';
		this.pauseIcon = 'icon ion-md-pause';
	}

	play(){
		this.audioElement.play();
		this.setState({ isPlaying: true });
	}

	pause(){
		this.audioElement.pause();
		this.setState({ isPlaying: false });
	}

	setSong(song){
		this.audioElement.src = song.audioSrc;
		this.setState({ currentSong: song });
	}

	handleSongClick(song){
		const isSameSong = this.state.currentSong === song;
		if (this.state.isPlaying && isSameSong) {
			this.pause();
		} else {
			if (!isSameSong){ 
				this.setSong(song);
			}
			this.play();
		}
	}

	songMouseEnter(e, song){
		if (this.state.currentSong !== song){
			let songNumber = e.currentTarget.children[0].children[0];
			this.setState({ hoverVal: songNumber.innerHTML });
			this.playIconToggle(songNumber);
		}
	}
	
	songMouseExit(e, song){
		if (this.state.currentSong !== song){
			let songNumber = e.currentTarget.children[0].children[0];
			this.playIconToggle(songNumber, this.state.hoverVal);
			this.setState({ hoverVal: '' });
		}
	}

	playIconToggle(el, text){
		if(!text){
			el.innerHTML = '';
			el.className = this.playIcon;
		} else {
			el.innerHTML = text;
			el.className = '';
		}
	}

	displayPlayState(song, index){
		if (song === this.state.currentSong && this.state.isPlaying){
			// Playing - Pause Icon
			return (<span className={this.playIcon}></span>);
		} else if (song === this.state.currentSong && !this.state.isPlaying) {
			// Paused - Play Icon
			return (<span className={this.pauseIcon}></span>);
		} else if (song !== this.state.currentSong){
			return (<span className=''>{index + 1}</span>);
		}
	}

	render(){
		return (
			<section className='album'>
				<section id='album-info'>
					<img id='album-cover-art' src={ this.state.album.albumCover } alt={ this.state.album.title } />
					<div className='album-details'>
						<h1 id='album-title'>{ this.state.album.title }</h1>
						<h2 className='artist'>{ this.state.album.artist }</h2>
						<div id='release-info'>{ this.state.album.releaseInfo }</div>
					</div>
				</section>
				<table id='song-list'>
					<colgroup>
						<col id='song-number-column' />
						<col id='song-title-column' />
						<col id='song-duration-column' />
					</colgroup>
					<tbody>
						{this.state.album.songs.map( (song, index) => 
							<tr className='song' key={index} onClick={ () => this.handleSongClick(song) } onMouseEnter={ (e) => this.songMouseEnter(e, song) } onMouseLeave={ (e) => this.songMouseExit(e, song) } >
								<td className='song-number'>{this.displayPlayState(song, index)}</td>
								<td className='song-title'>{song.title}</td>
								<td className='song-duration'>{song.duration}</td>
							</tr>
						)}
					</tbody>
				</table>
			</section>
		)
	}
}

export default Album;