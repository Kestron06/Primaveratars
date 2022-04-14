/**
Heavy credit is due to @Clovenbob from Khan Academy. I took inspiration from his Catageis extension and used it as a base while 
developing this one.
*/

// Prometheus was here

/*
This is a heavily modified function originally from CoraL's
Primavera webpage. Warning: it's pretty messy! It
sifts through Primavera's comments using the KA API
and looks for comments that have the particular syntax
of a join code. Then it adds them to the participant list.
My modifications were using regex instead of whatever horror CoraL was
using to filter member join codes, return the members as
a list instead of putting them in a participant list, adding
comments, as well as reducing the use of global variables
from inside the function.

Note: it returns a Promise. So you'd need to add a .then()
or an await in order to use the data it provides.
For example:
fetchMembers().then(function(memberList) {
	// This should log a member's name
	console.log(memberList[0].name);
});
// this also works if you are in an asynchronous function
let memberList = await fetchMembers();
*/
function fetchMembers() {
	return fetch("https://www.khanacademy.org/api/internal/discussions/scratchpad/6556387095134208/comments?limit=1000")
		.then(r => r.json()).then(function (data) {
			// Get all comments from the program
			var feedback = data['feedback'];
			var members = [];
			// Regular expression to find team join codes
			var regex = /~\["","Icicle"|"Pyroach"|"Mountaintop"|"Cloudlark"|"Terratrice"|"Buzzaw",[0-9]\]~/gi;

			// This function loops over a number (i)
			// and looks it up in the comments array
			// to add it to the member list if it's a
			// member join code

			// Get members from the comments
			feedback.forEach(data => {
				// Get the actual text instead
				// of the metadata
				var cont = data.content;

				// Check if it's a join code
				if (!cont.match(regex)) { return; }

				// This removes everything
				// else from the join code
				// by only getting stuff
				// from between the tildas
				var indices = [];
				for (var i = 0; i < cont.length; i++) {
					if (cont[i] === '~') {
						indices.push(i);
					}
				}
				cont = cont.substring(indices[0] + 1, indices[1]);

				// Convert it from a string into a
				// real Javascript array so that we
				// can access info
				cont = JSON.parse(cont);

				members.push({
					name: data.authorNickname,
					team: cont[1],
					lvl: cont[2]
				});
			});

			return members;
		});
};

fetchMembers().then(function (peeps) {
	const prefix = "https://www.khanacademy.org/computer-programming/-";
	const avatars = {
		Terratrice: [
			"5487392290029568",
			"4523887042805760",
			"4523887042805760",
			"5499167546851328",
			"5962079136202752"
		],
		Pyroach: [
			"5299648263667712",
			"5769125233213440",
			"4984313234898944",
			"4751334149505024",
			"5682783170117632",
		],
		Buzzaw: [
			"4547885642334208",
			"5272137119088640",
			"5323912882733056",
			"6192871001604096",
			"5885499318255616",
		],
		Icicle: [
			"4790565790072832",
			"4701002367287296",
			"5819298168750080",
			"5924358504628224",
			"4834125616824320",
		],
		Cloudlark: [
			"5859224721604608",
			"6679647025676288",
			"5655810299445248",
			"5621130390978560",
			"6521652627161088",
		],
		Mountaintop: [
			"6248793421955072",
			"5080810077077504",
			"4516922411499520",
			"4846611355189248",
			"6081598129750016",
		],
		Judge: [
			"",
			"",
			"",
			"5687537698914304",
			"5120079835480064",
		],
	};
	function replaceAvatar(className) {
		// This gets the name of the user if you're on a user profile endpoint
		// For example, on https://khanacademy.org/profile/Velocity2000 it
		// would output Prometheus. Why does KA have weird names for their classes?
		// That's a very good question
		// We're using a ternary operator check here because this class doesn't
		// exist on most pages.
		let profileName = (document.querySelector("._o77ufew") ?
			document.querySelector("._o77ufew").innerHTML : "");

		// This loops over every avatar on the page
		// and checks if it belongs to anybody in our list
		let avatarElements = Array.from(document.getElementsByClassName(className));
		avatarElements.forEach(avatar => {
			peeps.forEach(user => {
				// Check if any comment's avatar's alt attribute matches with our user
				// Alternatively if we're on a profile endpoint, check if the profile name
				// matches with a Primavera member
				if (avatar.alt.endsWith(user.name) || user.name == profileName) {
					// This may look a bit hairy, but have no fear!
					// This sets the avatar image to the Primavera avatar.
					// avatars[user.team] gets a list of the team's avatars
					// After that we search that list for the avatar for our
					// particular level. And the prefix bit is just to get
					// that team's icon program image on KA.
					avatar.src = `${prefix}/${avatars[user.team][user.lvl]}/latest.png`;
				}
			});
		});
	}

	chrome.runtime.onMessage.addListener(() => {
			replaceAvatar("avatar-pic");
			replaceAvatar("_9phhti");
			replaceAvatar("_1u01yeu");
		});
	window.setInterval(replaceAvatar, 10000);
})


