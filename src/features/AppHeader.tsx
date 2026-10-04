import type { PropsWithChildren } from 'hono/jsx';

interface Props {
  userName: string;
}

/**
 * 全画面で共通のヘッダー (サービス名とログイン中のユーザー名)
 *
 * @remarks `children` に渡した要素 (タブなど) は、ヘッダーの下に続けて、まとめてスクロールに追従する
 */
export function AppHeader({ userName, children }: PropsWithChildren<Props>) {
  return (
    <div class="sticky top-0 z-20">
      <header class="flex items-center justify-between gap-s p-s text-white bg-blue-500">
        <a class="text-18 font-bold" href="/">
          Hocus Pocus
        </a>
        <p class="min-w-0 truncate text-12">{userName} さん</p>
      </header>
      {children}
    </div>
  );
}
