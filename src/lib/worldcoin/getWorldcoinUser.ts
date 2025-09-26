export const getWorldcoinUser = async ({ address }: { address: string }) => {
  const res = await fetch('https://usernames.worldcoin.org/api/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      addresses: [address],
    }),
  })

  const usernames = await res.json()
  const username = usernames?.[0]

  if (!username) {
    return {
      worldcoinUser: {
        username: '-',
        address,
        profilePictureUrl: null,
      },
    }
  }

  return {
    worldcoinUser: {
      username: username.username,
      address,
      profilePictureUrl: username.profile_picture_url,
    },
  }
}
