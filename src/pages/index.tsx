import React from 'react';

import { ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/solid';
import moment, { Moment } from 'moment';
import { findWhere } from 'underscore';

import 'moment/locale/id';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

moment.locale('id');

type AuthorRoleType = 'bot' | 'user';

type AuthorType = {
  avatar: string;
  name: string;
  role: AuthorRoleType;
};

type MessageType = {
  createdAt: Moment;
  author: AuthorType;
  text: string;
};

type BotMessageNameType =
  | string
  | 'hello'
  | 'skills'
  | 'day'
  | 'date'
  | 'time'
  | 'weather';

type BotMessageType = {
  name: BotMessageNameType;
  message: MessageType;
};

const Index = () => {
  const botAuthor: AuthorType = {
    avatar:
      'https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat3&accessoriesType=Kurt&hatColor=Blue01&hairColor=Platinum&facialHairType=MoustacheMagnum&facialHairColor=Platinum&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Hearts&eyebrowType=Angry&mouthType=Default&skinColor=Brown',
    name: 'Frankenstein Bot',
    role: 'bot',
  };

  const userAuthor: AuthorType = {
    avatar:
      'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=SilverGray&facialHairType=Blank&clotheType=Overall&clotheColor=Gray01&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Pale',
    name: 'anggiedimasta',
    role: 'user',
  };

  const welcomeMessage: MessageType = {
    createdAt: moment(),
    author: botAuthor,
    text: 'Hi, there anggiedimasta',
  };

  const botMessages: BotMessageType[] = [
    {
      name: 'hello',
      message: welcomeMessage,
    },
  ];

  const messageList: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  const inputMessage: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  const [messages, setMessages] = React.useState<MessageType[]>([]);

  const sendMessage = (
    event: React.SyntheticEvent,
    author?: AuthorRoleType,
    botMessageName?: BotMessageNameType
  ): void => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      new_message: { value: string };
    };

    const message: string = target.new_message.value;
    let newMessages: MessageType[] = [];

    if (author === 'bot') {
      const matchedMessage: BotMessageType | undefined = findWhere(
        botMessages,
        { name: botMessageName }
      );

      if (matchedMessage) {
        newMessages = [...messages, matchedMessage.message];
      }
      setMessages(newMessages);
    } else {
      newMessages = [
        ...messages,
        {
          author: userAuthor,
          createdAt: moment(new Date()),
          text: message,
        },
      ];
      setMessages(newMessages);
    }

    process.nextTick(() => {
      if (messageList.current?.lastElementChild) {
        target.new_message.value = '';
        messageList.current.scrollTo({
          behavior: 'smooth',
          top:
            messageList.current.lastElementChild.getBoundingClientRect().top +
            20,
        });
      }

      process.nextTick(() => {
        if (author !== 'bot') {
          sendMessage(event, 'bot', message);
        }
      });
    });
  };

  const messageOptions: string[] = [
    'hello',
    'skills',
    'day',
    'date',
    'time',
    'weather',
  ];

  const setMesageByOption = (event: React.SyntheticEvent): void => {
    const span = event.currentTarget.lastElementChild;

    if (span?.innerHTML && inputMessage?.current) {
      inputMessage.current.value = span.innerHTML;
    }
  };

  return (
    <Main meta={<Meta title="Chatbot" description="Beep Boop 🤖" />}>
      <div className="flex flex-col shadow-xl rounded-xl overflow-hidden max-w-3xl max-h-96 relative">
        <div className="sticky top-0 flex items-center justify-start border-b z-10 w-full p-3 bg-white">
          <ChevronLeftIcon className="h-8 w-8 text-gray-500" />
          <div className="flex rounded-full overflow-hidden border h-12 w-12 ml-3 bg-green-400">
            <img
              className="h-12 w-12"
              src="https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat3&accessoriesType=Kurt&hatColor=Blue01&hairColor=Platinum&facialHairType=MoustacheMagnum&facialHairColor=Platinum&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Hearts&eyebrowType=Angry&mouthType=Default&skinColor=Brown"
            ></img>
          </div>
          <div className="flex flex-1 font-semibold text-lg text-gray-600 px-3">
            <span className="tracking-wide">Frankenstein Bot</span>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full h-96 bg-gray-200">
          <div
            className="flex flex-col w-full p-4 overflow-scroll pb-20"
            ref={messageList}
          >
            {messages.map((message, i) => (
              <div
                className={`flex w-full mt-2 ${
                  message.author.role === 'bot'
                    ? 'justify-start'
                    : 'justify-end'
                }`}
                key={i}
              >
                <div
                  className={`flex rounded-full ${
                    message.author.role === 'bot' ? '' : 'flex-row-reverse'
                  }`}
                >
                  <img
                    className={`w-12 h-12 rounded-full border ${
                      message.author.role === 'bot'
                        ? 'bg-green-400'
                        : 'bg-pink-400'
                    }`}
                    src={message.author.avatar}
                  />
                  <div
                    className={`flex flex-col mx-2 w-full ${
                      message.author.role === 'bot'
                        ? 'items-start'
                        : 'items-end'
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        message.author.role === 'bot'
                          ? 'flex-row'
                          : 'flex-row-reverse'
                      }`}
                    >
                      <span className="flex font-medium text-sm">
                        {message.author.name}
                      </span>
                      <span className="flex mx-2">·</span>
                      <span className="flex font-light text-xs">
                        {moment(message.createdAt).format('lll')}
                      </span>
                    </div>
                    <span
                      className={`flex tracking-wide text-base py-2 px-3 rounded-full mt-1 ${
                        message.author.role === 'bot'
                          ? 'bg-white'
                          : 'text-white bg-gradient-to-tl from-indigo-500 to-purple-400'
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full px-4 absolute bottom-0 mb-20 z-10 items-center">
            {messageOptions.map((message, i) => (
              <button
                className="rounded-full flex items-center justify-center px-2 py-1 border-2 mx-1 border-blue-500"
                key={i}
                onClick={setMesageByOption}
              >
                <span className="text-blue-500 font-semibold text-sm">
                  {message}
                </span>
              </button>
            ))}
          </div>
          <form
            className="flex w-full sticky z-10 bottom-0"
            onSubmit={sendMessage}
          >
            <div className="flex items-center p-3 w-full h-16 bg-white border-t relative border-gray-200">
              <input
                className="h-12 border pl-3 pr-24 py-2 shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-full"
                name="new_message"
                placeholder="Write a message..."
                type="text"
                ref={inputMessage}
              />
              <button
                className="absolute flex items-center flex-row right-0 text-white mr-4 h-10 px-3 bg-gradient-to-tl from-indigo-600 to-purple-500 rounded-full"
                type="submit"
              >
                <PaperAirplaneIcon
                  className="transform rotate-90 h-6 w-6 mr-1"
                  name="send-message"
                />
                <label className="text-sm font-bold" htmlFor="send-message">
                  Sent
                </label>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Main>
  );
};

export default Index;
