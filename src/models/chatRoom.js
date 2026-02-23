// ✅ Correct format for chatRoom.js
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define("ChatRoom", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        visitor_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        visitor_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("active", "closed", "completed"),
            defaultValue: "active"
        }
    }, {
        tableName: "ChatRooms",
        timestamps: true
    });

    return ChatRoom;
};