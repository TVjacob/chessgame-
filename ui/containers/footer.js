import React from 'react'

const footerItems = [
  {link: 'https://support.chess.com/', title: 'Help'},
  {link: '/why', title: 'Why Join?'},
  {link: '/about', title: 'About'},
  {link: '/jobs', title: 'Jobs'},
  {link: '/developers', title: 'Developers'},
  {link: '/legal/user-agreement', title: 'User Agreement'},
  {link: '/legal/privacy', title: 'Privacy'},
  {link: '/legal/fair-play', title: 'Fair Play'},
  {link: '/legal/community', title: 'Community'},
  {link: '/', title: 'Chess.com © 2021'},
];
const socials = [
  {icon: <i className="fab fa-apple" />, link: '/play/apps/ios'},
  {icon: <i className="fab fa-android" />, link: '/play/apps/android'},
  {icon: <i className="fab fa-facebook" />, link: 'https://www.facebook.com/chess'},
  {icon: <i className="fab fa-twitter" />, link: 'https://twitter.com/chesscom'},
  {icon: <i className="fab fa-youtube" />, link: 'https://www.youtube.com/user/wwwChesscom'},
  {icon: <i className="fab fa-twitch" />, link: 'https://www.twitch.tv/chess'},
  {icon: <i className="fab fa-instagram" />, link: 'https://www.instagram.com/wwwchesscom'},
  {icon: <i className="fab fa-discord" />, link: 'https://discord.gg/3VbUQME'}
]
const Footer = () => {
  return (
    <div className='navigation-footer-component'>
      <div className='navigation-footer-left'>
        {footerItems.map(item => (
          <a
            key={item.title}
            href={item.link}
            target='_blank'
            rel='noopener'
            className='navigation-footer-page-component'
          >
            {item.title}
          </a>
        ))}
      </div>
      <div className='navigation-footer-platforms-component'>
        {socials.map((item, index) => (
          <a href={item.link} key={index} className='navigation-footer-platforms'>
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Footer
