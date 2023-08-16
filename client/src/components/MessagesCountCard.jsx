const MessageCountCard = ({ messageCount = 0, loading }) => {
  if (loading) {
    return (
      <div className="chart-loader">
        <div className="spinner"></div>
      </div>
    )
  }
  return (
    <div className="bg-gray-500 rounded-lg shadow p-4 text-center">
      <h2 className="text-lg font-medium mb-2 text-white">
        No. of Messages in Current month.
      </h2>
      <p className="text-3xl font-bold text-white">{messageCount}</p>
    </div>
  )
}

export default MessageCountCard
