import React from 'react';

import { ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/solid';
import moment, { Moment } from 'moment';
import { findWhere, last } from 'underscore';

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

type BotTypingProps = {
  show: boolean;
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

  const skillsMessage: MessageType = {
    createdAt: moment(),
    author: botAuthor,
    text: 'My skills are telling you what day it is today, what date it is, what time it is, also the weather forecast for today.',
  };

  const dayMessage: MessageType = {
    createdAt: moment(),
    author: botAuthor,
    text: moment().format('dddd'),
  };

  const dateMessage: MessageType = {
    createdAt: moment(),
    author: botAuthor,
    text: moment().format('LL'),
  };

  const timeMessage: MessageType = {
    createdAt: moment(),
    author: botAuthor,
    text: moment().format('h:mm:ss a'),
  };

  const botMessages: BotMessageType[] = [
    {
      name: 'hello',
      message: welcomeMessage,
    },
    {
      name: 'skills',
      message: skillsMessage,
    },
    {
      name: 'day',
      message: dayMessage,
    },
    {
      name: 'date',
      message: dateMessage,
    },
    {
      name: 'time',
      message: timeMessage,
    },
  ];

  const messageList: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  const inputMessage: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  const loadingDots: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [isBotTyping, setIsBotTyping] = React.useState<boolean>(false);

  const sendMessage = (
    event?: React.SyntheticEvent | null,
    author?: AuthorRoleType,
    botMessageName?: BotMessageNameType
  ): void => {
    if (event) {
      event.preventDefault();
    }

    let newMessages: MessageType[] = [];

    if (author === 'bot') {
      const matchedMessage: BotMessageType | undefined = findWhere(
        botMessages,
        { name: botMessageName }
      );

      if (matchedMessage) {
        newMessages = [...messages, matchedMessage.message];
        setMessages(newMessages);
      }
    } else if (event) {
      const target = event.target as typeof event.target & {
        new_message: { value: string };
      };

      const message: string = target.new_message.value;

      if (message.length > 0) {
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
    }

    process.nextTick(() => {
      if (event) {
        const target = event.target as typeof event.target & {
          new_message: { value: string };
        };

        target.new_message.value = '';
      }
    });
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      if (last(messages)?.author.role === 'user' && last(messages)?.text) {
        let botTypingTimer: number;
        const checkMatchedBotMessage: BotMessageType | undefined = findWhere(
          botMessages,
          { name: last(messages)?.text }
        );

        if (checkMatchedBotMessage) {
          setTimeout(() => {
            setIsBotTyping(true);
            botTypingTimer = window.setInterval(function () {
              if (
                loadingDots.current &&
                loadingDots.current.innerHTML.length > 2
              )
                loadingDots.current.innerHTML = '';
              else if (loadingDots.current)
                loadingDots.current.innerHTML += '.';
            }, 750);
          }, 1500);

          setTimeout(() => {
            clearInterval(botTypingTimer);
            setIsBotTyping(false);

            process.nextTick(() => {
              sendMessage(null, 'bot', last(messages)?.text);
            });
          }, 4500);
        }
      }
    }
  });

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

  const BotTypingBubble = (props: BotTypingProps) => {
    if (!props.show) {
      return null;
    }

    return (
      <div className="flex w-full mt-2 justify-start">
        <div className="flex rounded-full">
          <img
            className="w-12 h-12 rounded-full border bg-green-400"
            src={botAuthor.avatar}
          />
          <div className="flex flex-col mx-2 w-full items-start">
            <div className="flex items-center">
              <span className="flex font-medium text-sm">{botAuthor.name}</span>
            </div>
            <span
              className="flex tracking-wide text-base py-2 px-3 rounded-full mt-1 bg-white"
              ref={loadingDots}
            >
              .
            </span>
          </div>
        </div>
      </div>
    );
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
            className="flex flex-col w-full p-4 overflow-scroll pb-36"
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
                      className={`flex tracking-wide text-base py-2 px-3 rounded-xl mt-1 max-w-xs ${
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
            <BotTypingBubble show={isBotTyping} />
          </div>
          <div className="flex w-full px-4 absolute bottom-0 mb-20 z-10 items-center">
            {messageOptions.map((message, i) => (
              <button
                className="rounded-full flex items-center justify-center px-2 py-1 border-2 mx-1 bg-gradient-to-tl from-indigo-400 to-purple-400"
                key={i}
                onClick={setMesageByOption}
              >
                <span className="text-white font-semibold text-sm">
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
