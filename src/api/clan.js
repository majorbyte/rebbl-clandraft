export default {
  getMatchup : async (payload) => {
    let result;
    if (payload && payload.division)
      result = await fetch(`/api/v2/clan/draft/${payload.division}/${payload.round}/${payload.house}`);
    else
      result = await fetch(`/api/v2/clan/draft/`);
    if (result.ok){
      let data = await result.json();
      return data;
    }
    return null;
  },
  getPowers : async () => {
    let result = await fetch(`/api/v2/clan/powers`);
    if (result.ok) return await result.json();
    return null;
  },
  getTeamPlayers : async(teamId) => {
    let result = await fetch(`/api/v2/team/${teamId}/players`);
    if(result.ok) return await result.json();
    return null;
  },
  saveContests : async (data) => {
    let result = await fetch(`/api/v2/clan/draft`,{
      method:"POST",
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (result.ok) return true;
    let error = await result.json();
    return error.message;
  },
  confirmContests : async (data) => {
    let result = await fetch(`/api/v2/clan/draft`,{
      method:"PUT",
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (result.ok) return true;
    let error = await result.json();
    return error.message;
  }
}