'use client'

import React, { useState } from 'react'
import InstagramTabStory from './instagram-tab-story'
import InstagramTabStoryTechTask from './instagram-tab-story-tech-task'
import { type InstagramAdPostType } from '@/database/ad-post/post/post-types'

const InstagramTab = () => {
    const [postType, setPostType] = useState<InstagramAdPostType>('story');

    return (
        <div className='w-full mt-6'>
            <div className=''>
                {postType === 'story' ? (
                    <InstagramTabStory onPostTypeChange={setPostType} />
                ) : postType === 'story-tech-task' ? (
                    <InstagramTabStoryTechTask onPostTypeChange={setPostType} />
                ) : null}
            </div>
        </div>
    )
}

export default InstagramTab