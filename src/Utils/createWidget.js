const createDivElement = (style, className, innerHTML) => {
    const element = document.createElement('div');
    className && (element.className = className);
    innerHTML && (element.innerHTML = innerHTML);
    Object.assign(element.style, style);
    return element;
  },
  createWidget = (user) => {
    const widget = createDivElement({
        display: 'flex',
        justifyContent: 'center',
      }, 'widget'),

      cursor = createDivElement({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '2px',
        height: '18px',
        zIndex: '1',
        borderRadius: '999px',
        boxShadow: 'rgb(0 0 0 / 25%) 0px 2px 3px 2px',
        background: user.color
      }, 'cursor'),

      profileCard = createDivElement({
        position: 'absolute',
        top: '-18px',
        left: '0',
        height: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '99px 99px 99px 0',
        padding: '0 8px 0 3px',
        boxShadow: 'rgb(0 0 0 / 25%) 0px 0px 3px 2px',
        background: user.color
      }, 'profileCard'),

      avatar = createDivElement({
        position: 'relative',
        width: '15px',
        height: '15px',
        borderRadius: '999px',
        margin: '0 5px 0 0',
        // backgroundImage: `url(${user?.photos[0].value.slice(0,-4)}15)`
        backgroundImage: user?.photos[0].value,
      }, 'avatar'),

      name = createDivElement({
        position: 'relative',
        color: 'black',
        fontSize: '10px',
        fontWeight: '500'
      }, 'name', user.name.givenName);

    widget.append(cursor, profileCard);
    profileCard.append(avatar, name);
    return widget;
  }

export {createWidget};