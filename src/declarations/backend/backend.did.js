export const idlFactory = ({ IDL }) => {
  const DesignId = IDL.Nat;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Design = IDL.Text;
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'deleteDesign' : IDL.Func([DesignId], [Result], []),
    'getDesign' : IDL.Func([DesignId], [IDL.Opt(Design)], ['query']),
    'listDesigns' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(DesignId, Design))],
        ['query'],
      ),
    'publishDesign' : IDL.Func([DesignId], [Result_1], []),
    'saveDesign' : IDL.Func([Design], [DesignId], []),
    'updateDesign' : IDL.Func([DesignId, Design], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
