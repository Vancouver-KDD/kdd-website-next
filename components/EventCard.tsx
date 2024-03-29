import { DateTime } from 'luxon'
import {getEventAnalytics} from '@/actions/firebase-action'
import Button from '@/components/Button'
import Image from 'next/image'
import {MDXRemote} from 'next-mdx-remote/rsc'
import {DB} from '@/app'

let dialog: HTMLDialogElement
let scrollToTopAnchor: HTMLDivElement

type Props = {
  event: DB.Event
}

function convertAutolinksToLinks(text: string) {
  const autolinkRegex = /<https?:\/\/[^\s]+>/g
  return text.replace(autolinkRegex, (match) => {
    // Remove the angle brackets
    const url = match.slice(1, -1)
    return `[${url}](${url})`
  })
}

export default async function EventCard({event}: Props) {
  const isPastEvent = DateTime.fromISO(event.date).diffNow().toMillis() < 0
  const eventAnalytics = await getEventAnalytics(event.id)
  const ticketsLeft =
    event.quantity -
    ((eventAnalytics?.ticketsConfirmedCount ?? 0) + (eventAnalytics?.ticketsOnHoldCount ?? 0))
  
  return (
    <>
      <button>
        <div className="w-full rounded-md overflow-clip grid max-md:grid-cols-1 md:grid-cols-2 group">
          <div className="h-full md:max-h-80 overflow-hidden">
            <div className="relative h-full w-full">
              <Image
                fill
                src={event.poster?.url}
                alt={event.poster?.filename ?? 'event poster'}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="h-full flex-col min-h-40 bg-gray-100 px-5 py-4 gap-3">
            <div>
              <p className="text-base">
                {DateTime.fromISO(event.date).toFormat('yyyy LLL dd H:mm a')}
              </p>
              <p className="text-sm font-medium">{event.location ?? ''}</p>
            </div>
            <h3 className="text-2xl font-bold line-clamp-1 -mt-1">{event.title ?? ''}</h3>
            <div className="line-clamp-6 text-base">
              <MDXRemote source={convertAutolinksToLinks(event.description) ?? ''} />
            </div>
            {event.id && (
              <Button
                size="md"
                disabled={
                  isPastEvent ||
                  eventAnalytics === undefined ||
                  (ticketsLeft < 0 && !event.joinLink)
                }
                className="rounded-full"
                href={event.joinLink ? event.joinLink : `/checkout/${event.id}`}>
                {isPastEvent
                  ? 'CLOSED'
                  : eventAnalytics === undefined
                  ? 'loading...'
                  : ticketsLeft < 0 && !event.joinLink
                  ? 'SOLD OUT'
                  : 'RSVP'}
              </Button>
            )}
          </div>
        </div>
      </button>

      {/* <dialog
  bind:this={dialog}
  on:click={() => dialog.close()}
  className="bg-transparent backdrop-blur-sm max-w-full max-h-full min-w-full min-h-full">
  <div className="grid items-center place-items-center max-w-3xl w-full h-screen m-auto">
    <div className="rounded-md overflow-clip" on:click|stopPropagation={() => null}>
      <div className="md:max-h-120">
        <img
          className="w-full object-cover transition-transform duration-500"
          src={event.poster?.url}
          alt="event poster" />
      </div>
      <div className="flex-col min-h-40 max-h-72 overflow-y-auto bg-gray-100 p-6 gap-3">
        <h3 className="text-2xl font-bold">{event.title ?? ''}</h3>
        <p className="text-sm [&>*]:pb-4">
          <!-- eslint-disable svelte/no-at-html-tags -->
          {@html Marked.parse(event.description ?? '')}
        </p>
        {#if event.id}
          <Button
            disabled={isPastEvent || $eventAnalyticsStore === undefined || ticketsLeft <= 0}
            className="rounded-full"
            href={event.joinLink ? event.joinLink : `/checkout/${event.id}`}>
            {isPastEvent
              ? 'CLOSED'
              : $eventAnalyticsStore === undefined
              ? 'loading...'
              : ticketsLeft > 0
              ? 'RSVP'
              : 'SOLD OUT'}
          </Button>
        {/if}
      </div>
    </div>
  </div>
</dialog> */}
    </>
  )
}

{
  /* <style>
  .line-clamp-6-safari {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: hidden;
    height: 5rem;
  }

  @media only screen and (max-width: 768px) {
    .line-clamp-6-safari {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: hidden;
      height: 7.5rem;
    }
  }
</style> */
}
