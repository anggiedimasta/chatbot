import { ReactNode } from 'react';

import { AppConfig } from '../utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-gray-700 bg-gray-200 min-h-screen">
    {props.meta}

    <div className="max-w-screen-md mx-auto">
      <div className="pt-16 pb-8">
        <div className="font-bold text-3xl text-gray-900">
          {AppConfig.title}
        </div>
        <div className="text-xl">{AppConfig.description}</div>
      </div>

      <div className="py-5 text-xl content mt-8">{props.children}</div>
    </div>
  </div>
);

export { Main };
