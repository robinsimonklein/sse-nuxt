export default defineEventHandler(async event => {
    const eventStream = createEventStream(event)

    const eventListener = async (e: Message) => {
        await eventStream.push(JSON.stringify({text: e.text, date: e.date}))
    }

    eventEmitter.on('message', eventListener)

    eventStream.onClosed(async () => {
        eventEmitter.off('message', eventListener)
        await eventStream.close()
    })

    return eventStream.send()
})