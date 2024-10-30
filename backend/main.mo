import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Result "mo:base/Result";

actor WebsiteBuilder {
    type Design = Text;
    type DesignId = Nat;

    stable var nextDesignId : Nat = 0;
    let designs = HashMap.HashMap<DesignId, Design>(0, Nat.equal, Hash.hash);

    public func saveDesign(design : Design) : async DesignId {
        let id = nextDesignId;
        designs.put(id, design);
        nextDesignId += 1;
        id
    };

    public query func getDesign(id : DesignId) : async ?Design {
        designs.get(id)
    };

    public func updateDesign(id : DesignId, newDesign : Design) : async Result.Result<(), Text> {
        switch (designs.get(id)) {
            case (null) {
                #err("Design not found")
            };
            case (?_) {
                designs.put(id, newDesign);
                #ok()
            };
        }
    };

    public func deleteDesign(id : DesignId) : async Result.Result<(), Text> {
        switch (designs.remove(id)) {
            case (null) {
                #err("Design not found")
            };
            case (?_) {
                #ok()
            };
        }
    };

    public query func listDesigns() : async [(DesignId, Design)] {
        Iter.toArray(designs.entries())
    };

    public func publishDesign(id : DesignId) : async Result.Result<Text, Text> {
        switch (designs.get(id)) {
            case (null) {
                #err("Design not found")
            };
            case (?design) {
                // In a real-world scenario, you would generate a unique URL and host the design
                // For this example, we'll just return a placeholder URL
                #ok("https://example.com/published-design/" # Nat.toText(id))
            };
        }
    };

    system func preupgrade() {
        // This function is called before upgrading the canister
        // You can use it to store any necessary state
    };

    system func postupgrade() {
        // This function is called after upgrading the canister
        // You can use it to restore any necessary state
    };
}
