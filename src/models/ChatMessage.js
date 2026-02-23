// ✅ Correct format for chatMessage.js
module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define("ChatMessage", {
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sender_type: {
            type: DataTypes.ENUM("visitor", "staff"),
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: "ChatMessages",
        timestamps: true
    });

    return ChatMessage;
};