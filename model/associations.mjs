export default ({ Appartment, Room, Post, File, PostFile }) => {
  Appartment.hasMany(Room, { foreignKey: "appartmentId", as: "rooms", onDelete: "CASCADE" })
  Room.belongsTo(Appartment, { foreignKey: "appartmentId", as: "appartment" })

  Appartment.hasMany(Post, { foreignKey: "appartmentId", as: "posts", onDelete: "SET NULL" })
  Post.belongsTo(Appartment, { foreignKey: "appartmentId", as: "appartment" })

  File.hasMany(Post, { foreignKey: "heroImageId", as: "posts", onDelete: "SET NULL" })
  Post.belongsTo(File, { foreignKey: "heroImageId", as: "heroImage", })

  Post.belongsToMany(File, { through: PostFile, as: 'contentFiles', foreignKey: 'postId', otherKey: 'fileId' })
  File.belongsToMany(Post, { through: PostFile, as: 'inContentPosts', foreignKey: 'fileId', otherKey: 'postId' })
}