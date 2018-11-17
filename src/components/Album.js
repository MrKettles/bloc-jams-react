import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

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
			currentTime: 0,
			duration: album.songs[0].duration, // Can you just use currentSong.duration?
			volume: 0.8,
			hoverVal: 0
		};

		this.audioElement = document.createElement('audio');
		this.audioElement.src = album.songs[0].audioSrc;
		this.playIcon = 'icon ion-md-play';
		this.pauseIcon = 'icon ion-md-pause';
	}

	componentDidMount(){
		this.eventListeners = {
			timeupdate: e => {
				this.setState({ currentTime: this.audioElement.currentTime });
			}, 
			durationchange: e => {
				this.setState({ duration: this.audioElement.duration });
			},
			volumechange: e => {
				this.setState({ volume: this.audioElement.volume });
			}
		}; 
		this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
		this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
		this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
	}

	componentWillUnmount(){
		this.audioElement.src = null;
		this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
		this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
		this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
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

	handlePrevClick(){
		const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
		const newIndex = Math.max(0, currentIndex - 1);
		const newSong = this.state.album.songs[newIndex];
		this.setSong(newSong);
		this.play();
	}

	// The following is how I coded the function before I looked at the Bloc solution.
	// Wasn't sure if there was a reason that one would be preferable over the other.
	// handlePrevClick(){
	// 	let newIndex = this.state.album.songs.findIndex(song => song === this.state.currentSong) - 1;
	// 	if (newIndex >= 0){
	// 		this.setSong(this.state.album.songs[newIndex]);
	// 		if(this.state.isPlaying) this.play();
	// 	}
	// }

	handleNextClick(){
		const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
		const newIndex = Math.min(currentIndex + 1, this.state.album.songs.length - 1);
		const newSong = this.state.album.songs[newIndex];
		this.setSong(newSong);
		this.play();
	}

	handleTimeChange(e){
		const newTime = this.audioElement.duration * e.target.value;
		this.audioElement.currentTime = newTime;
		this.setState({ currentTime: newTime})
	}

	formatTime(time){
		if (!time || isNaN(time)) return '0:00';
		let min = Math.floor(time/60);
		let sec = Math.floor(time%60);
		return (min + ':' + (sec < 10 ? '0' + sec : sec));
	}

	handleVolChange(e){
		const newVol = e.target.value;
		this.audioElement.volume = newVol;
		this.setState({ volume: newVol }); 
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
				<PlayerBar
					isPlaying={this.state.isPlaying}
					currentSong={this.state.currentSong}
					currentTime={this.audioElement.currentTime}
					duration={this.audioElement.duration}
					volume={this.state.volume}
					handleSongClick={() => this.handleSongClick(this.state.currentSong)}
					handlePrevClick={() => this.handlePrevClick()}
					handleNextClick={() => this.handleNextClick()}
					handleTimeChange={(e) => this.handleTimeChange(e)}
					formatTime={(e) => this.formatTime(e)}
					handleVolChange={(e) => this.handleVolChange(e)}
				/>
			</section>
		)
	}
}

export default Album;