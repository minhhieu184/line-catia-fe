// import { classNames } from '@telegram-apps/sdk';
// import { useUtils } from '@telegram-apps/sdk-react';
import { type FC, type MouseEventHandler, useCallback } from 'react';
import { type LinkProps, Link as RouterLink } from 'react-router-dom';

import './Link.css';

export const Link: FC<LinkProps> = (props) => {
  const { className, onClick: propsOnClick, to } = props;
  // const utils = useUtils();

  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      propsOnClick?.(e);

      // Compute if target path is external. In this case we would like to open link using
      // TMA method.
      let path: string;
      if (typeof to === 'string') {
        path = to;
      } else {
        const { search = '', pathname = '', hash = '' } = to;
        path = `${pathname}?${search}#${hash}`;
      }

      const targetUrl = new URL(path, window.location.toString());
      const currentUrl = new URL(window.location.toString());
      const isExternal = targetUrl.protocol !== currentUrl.protocol || targetUrl.host !== currentUrl.host;

      if (isExternal) {
        e.preventDefault();
        // return utils.openLink(targetUrl.toString());
        return window.open(targetUrl.toString(), '_blank');
      }
    },
    // [to, propsOnClick, utils]
    [to, propsOnClick]
  );

  return (
    <RouterLink
      {...props}
      onClick={onClick}
      // className={classNames(className, "link")}
      className='link'
    />
  );
};
