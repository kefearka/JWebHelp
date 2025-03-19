export class YandexNavigator {
    static buildRoute(addresses) {
      return `https://yandex.ru/navi/?route=${encodeURIComponent(addresses.join(','))}`;
    }
  }