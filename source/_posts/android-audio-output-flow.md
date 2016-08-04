title: android audio output flow
description: android audio output flow
tags: [Android, Audio, System]
keywords: android,audioflinger,audio
category: Android
---
AudioTrack.java  Constructor
 创建AudioTrackThread, 创建AudioTrack，Track, 生成sessionId. 创建MixerThread,  打开output device(audio_policy.conf), hal outputStream,
```
	android_media_AudioTrack.cpp: android_media_AudioTrack_setup    native_setup
	AudioTrack.set
		check and set audio params
		new session id
		new AudioTrackThread
		createTrack_l
			AudioSystem::getOutputForAttr --> IAudioPolicyService::getOutputForAttr --> AudioPolicyManager::getOutputForAttr 
				routing_strategy strategy = (routing_strategy) getStrategyForAttr(&attributes);
				audio_devices_t device = getDeviceForStrategy(strategy, false /*fromCache*/);
				*stream = streamTypefromAttributesInt(&attributes);
				*output = getOutputForDevice(device, session, *stream,
				                                 samplingRate, format, channelMask,
				                                 flags, offloadInfo);
					        getOutputForDevice()
							profile = getProfileForDirectOutput()
							mpClientInterface->openOutput-->AudioPolicyClientImpl::openOutput-->AF->openOutput
								AF::openOutput_l()
									hal::open_output_stream()
									AudioStreamOut *outputStream = new AudioStreamOut(outHwDev, outStream, flags);
									thread = new MixerThread(this, outputStream, *output, devices);
									mPlaybackThreads.add(*output, thread);
			sp<IAudioTrack> track = audioFlinger->createTrack  //mAudioTrack
				AF::createTrack
					PlaybackThread *thread = checkPlaybackThread_l(output);    //刚刚的mPlaybackThreads.add(*output, thread);
					track = thread->createTrack_l()
						        if (!isTimed) {
						            track = new Track(this, client, streamType, sampleRate, format,
						                              channelMask, frameCount, NULL, sharedBuffer,
						                              sessionId, uid, *flags, TrackBase::TYPE_DEFAULT);
							  Tracks.cpp
						        } else {
						            track = TimedTrack::create(this, client, streamType, sampleRate, format,
						                    channelMask, frameCount, sharedBuffer, sessionId, uid);
						        }
						        
						        // 如果 有effect
						        sp<EffectChain> chain = getEffectChain_l(sessionId);
						        if (chain != 0) { 
						            ALOGV("createTrack_l() setting main buffer %p", chain->inBuffer());
						            track->setMainBuffer(chain->inBuffer());
						            chain->setStrategy(AudioSystem::getStrategyForStream(track->streamType()));
						            chain->incTrackCnt();
						        }    
									
			AudioSystem::getSamplingRate(output, &afSampleRate); --> AudioSystem --> AudioFlinger --> PlaybackThread.sampleRate()
		AudioSystem::acquireAudioSessionId()
```		
	

主要是把track添加到mActiveTracks里
```	
AudioTrack.java start
	AudioTrack.cpp::start
		Track.cpp::start
			playbackThread->addTrack_l
				status = AudioSystem::startOutput   --> AudioPolicyService::startOutput --> AudioPolicyManager::startOutput
				mActiveTracks.add(track);		
```
		
把数据写到buffer里		
```
AudioTrack.java write
	android_media_AudioTrack.cpp: native_write_byte  write
		writeToTrack
		AudioTrack.cpp :: write 
			av/media/libmedia/AudioTrackShared.cpp :: ClientProxy::obtainBuffer
		write to Track::mMainBuffer ( is mSinkBuffer )
```		


playback线程，混音和把数据写到hal
```
AudioFlinger::PlaybackThread::threadLoop()
	mixer_state = AudioFlinger::MixerThread::prepareTracks_l()
		mAudioMixer->setParameter(VOLUME0 and VOLUME1 and RESAMPLE)
	AudioFlinger::MixerThread::threadLoop_mix()  
		mAudioMixer->process(pts);
		hook-> process__validate (process_nop, process_noresampling, process_resampling) -> trackt::track__16BitsStereo...track__Resample
	threadLoop_write()
	    bytesWritten = mOutput->stream->write(mOutput->stream,
	               (char *)mSinkBuffer + offset, mBytesRemaining);
		void* mSinkBuffer;                  // used for mixer output format translation 写hardware的data, 除非有effect
```

1. 混音前的准备工作，prepareTracks_l, 设置混音所需要的参数，包括：音量，混音的源buffer，混音目的buffer，音频格式，是否重采样等。    
2. 混音，threadLoop_mix
3. 音频输出，threadLoop_write， mSinkBuffer
