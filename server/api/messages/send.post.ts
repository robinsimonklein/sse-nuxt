export default defineEventHandler(async event => {
    const {message} = await readBody<{ message?: string }>(event)

    if (!message?.length) throw createError({statusCode: 400, message: 'Missing message'})

    eventEmitter.emit('message', { text: message, date: new Date() })
    return null
})