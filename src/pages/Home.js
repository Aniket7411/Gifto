import React from 'react';
import GiftCollections from '../components/giftcollections';
import TopSection from './homepage/topsection';
import GiftsCarousel from './homepage/giftcarousel';
import RingSection from './homepage/ringsection';
import GiftInquirySection from './homepage/topcarausel';
import TestimonialCarousel from './homepage/testimonialcarousel';

const Home = () => {
    return (
        <div className="overflow-hidden">
            <TopSection />

            <GiftsCarousel />
            <GiftInquirySection />
            <RingSection />
            <GiftCollections />
            <TestimonialCarousel />
        </div>
    );
};

export default Home;

