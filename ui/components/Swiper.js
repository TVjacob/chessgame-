import React from 'react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { makeStyles } from '@material-ui/core/styles';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Autoplay, Navigation, Pagination]);

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    padding: theme.spacing(0, 4, 3),
  },
}));

const SwiperTrial = ({data}) => {
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination
        autoplay={{"delay": 1000}}
        className='swiper-trial-container'
      >
        {data.map(item => (
          <SwiperSlide key={item.title}>
            <div className='trial-slideshow-upgrade-icon'>
              <div className='trial-slideshow-upgrade-icon-bg' />
              <div className={`trial-slideshow-upgrade-icon-img ${item.cls}`} />
            </div>
            <h2 className='trial-slideshow-slide-title'>{item.title}</h2>
            <h3 className='trial-slideshow-slide-subtitle'>{item.sub}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperTrial;
