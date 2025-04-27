const messages = []; // Temporary storage for messages

exports.sendMessage = (req, res) => {
    const { sender, receiver, message } = req.body;
    messages.push({ sender, receiver, message, timestamp: new Date() });
    res.status(201).json({ message: "Message sent successfully" });
};

exports.getMessages = (req, res) => {
    res.json(messages);
};


