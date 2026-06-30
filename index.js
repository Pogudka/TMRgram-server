const express = require('express');
const app = express();

// Позволяем серверу читать JSON из входящих POST-запросов
app.use(express.json());

// Временное хранилище сообщений (очистится при перезагрузке сервера)
let messages = [
    { timestamp: "00:00", sender: "Система", text: "Сервер успешно запущен!" }
];

// 1. GET-запрос: Отдаем сообщения в удобном для Lua текстовом формате
app.get('/get_messages', (req, res) => {
    // Формируем строку вида: "14:05|Alice|Привет\n14:06|Bob|И тебе привет"
    const textResponse = messages.map(m => `${m.timestamp}|${m.sender}|${m.text}`).join('\n');
    res.send(textResponse);
});

// 2. POST-запрос: Принимаем новые сообщения от TMRgram
app.post('/send_message', (req, res) => {
    const { sender, text } = req.body;
    
    // Генерируем текущее время (ЧЧ:ММ)
    const now = new Date();
    const timestamp = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    messages.push({ timestamp, sender, text });

    // Храним только последние 50 сообщений, чтобы не забивать память
    if (messages.length > 50) messages.shift();

    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TMRgram Server running on port ${PORT}`));
